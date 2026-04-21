import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Απαιτείται σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Μη έγκυρη σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, context, conversationHistory } = await req.json();

    if (!message || typeof message !== "string" || message.length > 5000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch holistic patient context (cached 15min)
    let holisticBlock = "";
    try {
      const ctxResp = await fetch(
        `${supabaseUrl}/functions/v1/assemble-patient-context`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            apikey: supabaseAnonKey!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );
      if (ctxResp.ok) {
        const { context: holistic } = await ctxResp.json();
        if (holistic) {
          const { buildHolisticContextPrompt } = await import(
            "../_shared/holistic-context.ts"
          );
          holisticBlock = buildHolisticContextPrompt(holistic);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch holistic context:", e);
    }

    const systemPrompt = `Είσαι ο Προληπτικός Σύμβουλος Υγείας & Τρόπου Ζωής του Medithos. Μιλάς Ελληνικά εκτός αν ο χρήστης γράφει σε άλλη γλώσσα.

ΚΡΙΣΙΜΟΙ ΚΑΝΟΝΕΣ:
- ΠΟΤΕ δεν διαγιγνώσκεις ασθένειες, ΠΟΤΕ δεν συνταγογραφείς, ΠΟΤΕ δεν αντικαθιστάς γιατρό
- ⚠ Πριν προτείνεις νέο φάρμακο/συμπλήρωμα, έλεγξε αλληλεπιδράσεις με τα τρέχοντα φάρμακα
- Σταθμίζεις κληρονομικούς κινδύνους όταν ερμηνεύεις συμπτώματα
- Χρησιμοποιείς καθησυχαστική, μη απόλυτη γλώσσα

ΤΙ ΚΑΝΕΙΣ:
- Προτείνεις lifestyle adjustments, προληπτικές εξετάσεις, διατροφικά πρότυπα
- Εντοπίζεις συσχετίσεις (συμπτώματα ↔ διατροφή ↔ ύπνος ↔ στρες ↔ wearables)
- Δημιουργείς εξατομικευμένους οδικούς χάρτες πρόληψης

ΜΟΡΦΟΠΟΙΗΣΗ: Markdown. Πάντα κατέληγε σε «τι να κάνεις ΤΩΡΑ + τι να παρακολουθήσεις».
Αν red flag: [SPECIALTY_RECOMMENDATION: ειδικότητα]
${holisticBlock}

ΕΠΙΠΛΕΟΝ live context (αν υπάρχει):
${context ? JSON.stringify(context, null, 2) : '—'}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build messages array with conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (max last 20 messages for context window)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-20);
      for (const msg of recentHistory) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limit", message: "Πολλά αιτήματα. Παρακαλώ περιμένετε λίγο." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "payment_required", message: "Απαιτείται ανανέωση credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error (${response.status})`);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Δεν μπόρεσα να δημιουργήσω απάντηση. Παρακαλώ δοκιμάστε ξανά.";

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Preventive advisor error:", error);
    return new Response(JSON.stringify({ error: "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
