import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FITBIT_API = 'https://api.fitbit.com';

async function refreshToken(connection: any, clientId: string, clientSecret: string) {
  const response = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return await response.json();
}

async function fetchFitbitData(accessToken: string, endpoint: string) {
  const response = await fetch(`${FITBIT_API}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    throw new Error('TOKEN_EXPIRED');
  }

  if (!response.ok) {
    throw new Error(`Fitbit API error: ${response.status}`);
  }

  return await response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID')!;
    const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get connection
    const { data: connection } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'fitbit')
      .eq('is_active', true)
      .single();

    if (!connection) {
      return new Response(JSON.stringify({ error: 'No active Fitbit connection' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update sync status
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    await adminClient
      .from('wearable_connections')
      .update({ sync_status: 'syncing' })
      .eq('id', connection.id);

    let accessToken = connection.access_token;

    // Check if token needs refresh
    if (new Date(connection.token_expires_at) <= new Date()) {
      try {
        const newTokens = await refreshToken(connection, FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET);
        accessToken = newTokens.access_token;

        await adminClient
          .from('wearable_connections')
          .update({
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
          })
          .eq('id', connection.id);
      } catch {
        await adminClient
          .from('wearable_connections')
          .update({ sync_status: 'error', sync_error: 'Token refresh failed. Please reconnect.' })
          .eq('id', connection.id);

        return new Response(JSON.stringify({ error: 'Token refresh failed' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const results: Record<string, any> = {};

    // Sync heart rate
    try {
      const hrData = await fetchFitbitData(accessToken, `/1/user/-/activities/heart/date/${today}/1d.json`);
      const heartRateZones = hrData?.['activities-heart']?.[0]?.value;
      
      if (heartRateZones?.restingHeartRate) {
        await supabase.from('wearable_heart_rate').upsert({
          user_id: user.id,
          source: 'fitbit',
          bpm: heartRateZones.restingHeartRate,
          heart_rate_type: 'resting',
          measured_at: new Date().toISOString(),
        });
        results.heart_rate = heartRateZones.restingHeartRate;
      }
    } catch (e) {
      console.error('Heart rate sync error:', e);
    }

    // Sync steps
    try {
      const stepsData = await fetchFitbitData(accessToken, `/1/user/-/activities/date/${today}.json`);
      const steps = stepsData?.summary?.steps;
      const distance = stepsData?.summary?.distances?.find((d: any) => d.activity === 'total')?.distance;
      const calories = stepsData?.summary?.caloriesOut;

      if (steps !== undefined) {
        await supabase.from('wearable_steps').upsert({
          user_id: user.id,
          source: 'fitbit',
          step_count: steps,
          distance_meters: distance ? Math.round(distance * 1000) : null,
          calories_burned: calories || null,
          date: today,
        }, { onConflict: 'user_id,source,date' });
        results.steps = steps;
      }
    } catch (e) {
      console.error('Steps sync error:', e);
    }

    // Sync SpO2
    try {
      const spo2Data = await fetchFitbitData(accessToken, `/1/user/-/spo2/date/${today}.json`);
      const spo2Value = spo2Data?.value?.avg;

      if (spo2Value) {
        await supabase.from('wearable_spo2').upsert({
          user_id: user.id,
          source: 'fitbit',
          spo2_value: spo2Value,
          measured_at: new Date().toISOString(),
        });
        results.spo2 = spo2Value;
      }
    } catch (e) {
      console.error('SpO2 sync error:', e);
    }

    // Sync sleep data to existing sleep_logs table
    try {
      const sleepData = await fetchFitbitData(accessToken, `/1.2/user/-/sleep/date/${today}.json`);
      const sleepLog = sleepData?.sleep?.[0];

      if (sleepLog) {
        await supabase.from('sleep_logs').upsert({
          user_id: user.id,
          sleep_start: sleepLog.startTime,
          sleep_end: sleepLog.endTime,
          quality_rating: Math.round((sleepLog.efficiency || 80) / 20), // Convert 0-100 to 1-5
          interruptions: sleepLog.levels?.summary?.wake?.count || 0,
          notes: `Fitbit sync: ${sleepLog.duration ? Math.round(sleepLog.duration / 60000) : 0}min, efficiency ${sleepLog.efficiency}%`,
        });
        results.sleep = { duration_min: Math.round((sleepLog.duration || 0) / 60000) };
      }
    } catch (e) {
      console.error('Sleep sync error:', e);
    }

    // Update connection
    await adminClient
      .from('wearable_connections')
      .update({
        sync_status: 'idle',
        sync_error: null,
        last_sync_at: new Date().toISOString(),
      })
      .eq('id', connection.id);

    return new Response(JSON.stringify({ success: true, synced: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Fitbit sync error:', error);
    return new Response(JSON.stringify({ error: 'Sync failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
