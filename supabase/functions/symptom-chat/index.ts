import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(JSON.stringify({ error: "Απαιτείται σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client to verify the user
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase configuration");
      return new Response(JSON.stringify({ error: "Σφάλμα διαμόρφωσης" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(JSON.stringify({ error: "Μη έγκυρη σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Authenticated user:", user.id);

    const { messages } = await req.json();
    
    // Validate messages input
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Μη έγκυρα μηνύματα" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Είσαι ένας ευγενικός και κατανοητικός βοηθός υγείας στην εφαρμογή Medithos. Ο ρόλος σου είναι να ακούς τον ασθενή και να τον βοηθάς να περιγράψει τα συμπτώματά του.

ΟΔΗΓΙΕΣ:
- Απάντα ΠΑΝΤΑ στα Ελληνικά
- Κάνε ερωτήσεις για να κατανοήσεις καλύτερα τα συμπτώματα (πού πονάει, πότε ξεκίνησε, πόσο έντονος είναι ο πόνος, κ.λπ.)
- Δείξε ενσυναίσθηση και κατανόηση
- ΜΗΝ δίνεις ιατρικές διαγνώσεις - μόνο βοήθα στην καταγραφή συμπτωμάτων
- Αν τα συμπτώματα ακούγονται επείγοντα (πόνος στο στήθος, δύσπνοια, αιμορραγία), προτείνε άμεση επίσκεψη σε γιατρό
- Κράτα τις απαντήσεις σύντομες και φιλικές (2-3 προτάσεις)
- Στο τέλος της συνομιλίας, κάνε μια σύνοψη των συμπτωμάτων

ΣΗΜΑΝΤΙΚΟ: Δεν είσαι γιατρός. Αυτό είναι μόνο για καταγραφή συμπτωμάτων, όχι για διάγνωση.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Πολλά αιτήματα. Παρακαλώ περιμένετε λίγο." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Απαιτείται πληρωμή για τη χρήση AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Σφάλμα AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("symptom-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Άγνωστο σφάλμα" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
