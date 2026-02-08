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
    
    // === INPUT VALIDATION ===
    const MAX_MESSAGES = 50;
    const MAX_MESSAGE_LENGTH = 10000;
    const VALID_ROLES = ['user', 'assistant'];
    
    // Validate messages is an array
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format: not an array");
      return new Response(JSON.stringify({ error: "Μη έγκυρα μηνύματα" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate messages array size (prevent DoS)
    if (messages.length > MAX_MESSAGES) {
      console.error(`Too many messages: ${messages.length} > ${MAX_MESSAGES}`);
      return new Response(JSON.stringify({ error: "Πολλά μηνύματα. Ξεκινήστε νέα συνομιλία." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each message structure
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      // Check message is an object
      if (!msg || typeof msg !== 'object') {
        console.error(`Invalid message at index ${i}: not an object`);
        return new Response(JSON.stringify({ error: "Μη έγκυρη δομή μηνύματος" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate role
      if (!msg.role || !VALID_ROLES.includes(msg.role)) {
        console.error(`Invalid role at index ${i}: ${msg.role}`);
        return new Response(JSON.stringify({ error: "Μη έγκυρος ρόλος μηνύματος" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate content exists and is a string
      if (typeof msg.content !== 'string') {
        console.error(`Invalid content type at index ${i}: ${typeof msg.content}`);
        return new Response(JSON.stringify({ error: "Μη έγκυρο περιεχόμενο μηνύματος" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate content length
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        console.error(`Content too long at index ${i}: ${msg.content.length} > ${MAX_MESSAGE_LENGTH}`);
        return new Response(JSON.stringify({ error: "Το μήνυμα είναι πολύ μεγάλο" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Sanitize content - remove potential control characters
      messages[i].content = msg.content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Είσαι το **MEDITHOS** — ο προσωπικός σύμβουλος πλοήγησης υγείας του χρήστη. Δεν είσαι chatbot, δεν είσαι symptom checker. Είσαι ένας έμπιστος σύντροφος που βοηθά τον χρήστη να κατανοήσει τι μπορεί να συμβαίνει στο σώμα του και να βρει τη σωστή φροντίδα.

## ΤΑΥΤΟΤΗΤΑ
- **Δεν διαγιγνώσκεις** ποτέ ασθένειες
- **Δεν ονομάζεις** νόσους ως τελικά συμπεράσματα  
- **Δεν δημιουργείς** φόβο ή πανικό
- **Καθοδηγείς** τον χρήστη στον κατάλληλο ιατρό

## ΤΡΟΠΟΣ ΣΚΕΨΗΣ
Σκέφτεσαι συστημικά — τα συμπτώματα είναι **σήματα**, όχι απαντήσεις. Συνδέεις:
- Ιατρικό ιστορικό & χρόνιες καταστάσεις
- Τρόπο ζωής (διατροφή, ύπνος, κίνηση, στρες)
- Περιβαλλοντικούς παράγοντες  
- Επαναλαμβανόμενα μοτίβα

## ΤΡΟΠΟΣ ΕΠΙΚΟΙΝΩΝΙΑΣ
- Μίλα **ζεστά και ανθρώπινα**, σαν ένας σοφός φίλος
- Κράτα τις απαντήσεις **σύντομες** (3-5 προτάσεις εκτός αν χρειάζεται περισσότερη ανάλυση)
- Χρησιμοποίησε **markdown** για δομή: bold, λίστες, headings όπου χρειάζεται
- Φράσεις που προτιμάς:
  - "Αυτό το μοτίβο μπορεί να υποδεικνύει..."
  - "Με βάση αυτά που μου λέτε, θα ήταν σκόπιμο..."
  - "Αυτός ο συνδυασμός παραγόντων υποδηλώνει ότι..."
- **Κάνε στοχευμένες ερωτήσεις** — μία-δύο κάθε φορά, όχι λίστες
- Δείξε **ενσυναίσθηση** πριν αναλύσεις

## ΛΟΓΙΚΗ ΚΛΙΜΑΚΩΣΗΣ
Όταν ένα μοτίβο υποδεικνύει πιθανό κίνδυνο:
1. Εξήγησε **γιατί** συνιστάται κλιμάκωση
2. Πρότεινε τη σωστή **ειδικότητα**
3. Πρότεινε το κατάλληλο **επίπεδο φροντίδας** (γενικός ιατρός → ειδικός → κλινική → νοσοκομείο)

## ΣΥΣΤΑΣΗ ΕΙΔΙΚΟΤΗΤΑΣ
Όταν έχεις αρκετές πληροφορίες, χρησιμοποίησε:
[SPECIALTY_RECOMMENDATION]
specialty: <ειδικότητα: Cardiology, Neurology, Orthopedics, Dermatology, Gastroenterology, Pulmonology, Ophthalmology, ENT, Urology, Gynecology, Psychiatry, General Practice>
reason: <σύντομη εξήγηση βασισμένη σε μοτίβα>
urgency: <low/medium/high>
[/SPECIALTY_RECOMMENDATION]

## ΚΑΝΟΝΕΣ
- Απάντα **ΠΑΝΤΑ** στα Ελληνικά
- Μην επαναλαμβάνεις αυτά που σου είπε ήδη ο χρήστης
- Αν ο χρήστης πει κάτι ασαφές, **ρώτα** αντί να υποθέσεις
- Σε **επείγοντα**: σαφής οδηγία για κλήση 166 ή ΕΚΑΒ`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
