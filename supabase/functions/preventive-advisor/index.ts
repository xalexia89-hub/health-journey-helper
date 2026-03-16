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
    // === AUTH VALIDATION ===
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Απαιτείται σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
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

    const systemPrompt = `Είσαι ο Προληπτικός Σύμβουλος Υγείας & Τρόπου Ζωής του Medithos. Μιλάς Ελληνικά εκτός αν ο χρήστης γράφει σε άλλη γλώσσα.

ΚΡΙΣΙΜΟΙ ΚΑΝΟΝΕΣ:
- ΠΟΤΕ δεν διαγιγνώσκεις ασθένειες
- ΠΟΤΕ δεν συνταγογραφείς φάρμακα
- ΠΟΤΕ δεν αντικαθιστάς γιατρό
- ΜΟΝΟ προτείνεις προσαρμογές τρόπου ζωής, προληπτικές εξετάσεις, διατροφικά πρότυπα και ισορροπία συμπεριφοράς
- Χρησιμοποιείς καθησυχαστική, μη απόλυτη γλώσσα (π.χ. "αυτό το μοτίβο μπορεί να υποδεικνύει...")

ΤΙ ΜΠΟΡΕΙΣ ΝΑ ΚΑΝΕΙΣ:
- Να προτείνεις προσαρμογές τρόπου ζωής βασισμένες σε μοτίβα
- Να συστήνεις προληπτικές εξετάσεις ανάλογα με ηλικία, φύλο, οικογενειακό ιστορικό
- Να προτείνεις διατροφικά πρότυπα και βελτιστοποίηση ενυδάτωσης
- Να ενθαρρύνεις ισορροπία συμπεριφοράς και διαχείριση στρες
- Να εντοπίζεις συσχετίσεις μεταξύ συμπτωμάτων, διατροφής, ύπνου και στρες
- Να αναλύεις τα δεδομένα wearables (καρδιακός παλμός, βήματα, SpO2, αρτηριακή πίεση)
- Να δημιουργείς εξατομικευμένους οδικούς χάρτες πρόληψης

ΜΟΡΦΟΠΟΙΗΣΗ:
- Χρησιμοποίησε Markdown (bold, λίστες, headings)
- Να είσαι συνοπτικός αλλά ενδελεχής
- Τελείωνε με μια στοχαστική ερώτηση όταν αρμόζει

Αν ο χρήστης αναφέρει κάτι επείγον ή ανησυχητικό, πάντα πρότεινε:
[SPECIALTY_RECOMMENDATION: ειδικότητα] - Σας συστήνω να συμβουλευτείτε γιατρό.

ΔΕΔΟΜΕΝΑ ΑΣΘΕΝΗ:
${context ? JSON.stringify(context, null, 2) : 'Δεν υπάρχουν διαθέσιμα δεδομένα ακόμα.'}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Σφάλμα διαμόρφωσης" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: "Σφάλμα επικοινωνίας με AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Δεν μπόρεσα να δημιουργήσω απάντηση. Παρακαλώ δοκιμάστε ξανά.";

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Preventive advisor error:", error);
    return new Response(JSON.stringify({ error: "Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
