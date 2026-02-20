import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';
const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID');
    const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      return new Response(JSON.stringify({ error: 'Fitbit credentials not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Step 1: Generate OAuth URL
    if (action === 'authorize') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const redirectUri = `${SUPABASE_URL}/functions/v1/fitbit-auth?action=callback`;
      const scopes = 'activity heartrate sleep profile oxygen_saturation';
      const state = user.id; // Pass user ID as state

      const authUrl = `${FITBIT_AUTH_URL}?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;

      return new Response(JSON.stringify({ url: authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 2: OAuth Callback
    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state'); // user_id
      const error = url.searchParams.get('error');

      if (error || !code || !state) {
        // Redirect back to app with error
        return new Response(null, {
          status: 302,
          headers: { Location: `${url.origin}/../settings?fitbit=error` }
        });
      }

      const redirectUri = `${SUPABASE_URL}/functions/v1/fitbit-auth?action=callback`;

      // Exchange code for tokens
      const tokenResponse = await fetch(FITBIT_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error('Fitbit token exchange failed:', tokenData);
        return new Response(`<html><body><script>window.location.href='/settings?fitbit=error';</script></body></html>`, {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      // Store tokens using service role
      const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

      const { error: upsertError } = await adminClient
        .from('wearable_connections')
        .upsert({
          user_id: state,
          provider: 'fitbit',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          external_user_id: tokenData.user_id,
          scopes: tokenData.scope?.split(' ') || [],
          is_active: true,
          last_sync_at: new Date().toISOString(),
          sync_status: 'idle',
        }, { onConflict: 'user_id,provider' });

      if (upsertError) {
        console.error('Failed to store Fitbit connection:', upsertError);
        return new Response(`<html><body><script>window.location.href='/settings?fitbit=error';</script></body></html>`, {
          headers: { 'Content-Type': 'text/html' }
        });
      }

      // Redirect back to app with success
      return new Response(`<html><body><script>window.location.href='/settings?fitbit=success';</script></body></html>`, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Step 3: Disconnect
    if (action === 'disconnect') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Revoke Fitbit token
      const { data: connection } = await supabase
        .from('wearable_connections')
        .select('access_token')
        .eq('user_id', user.id)
        .eq('provider', 'fitbit')
        .single();

      if (connection?.access_token) {
        await fetch('https://api.fitbit.com/oauth2/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
          },
          body: new URLSearchParams({ token: connection.access_token }),
        });
      }

      await supabase
        .from('wearable_connections')
        .update({ is_active: false, access_token: null, refresh_token: null })
        .eq('user_id', user.id)
        .eq('provider', 'fitbit');

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Fitbit auth error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
