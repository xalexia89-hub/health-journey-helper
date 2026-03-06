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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Απαιτείται σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
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
      return new Response(JSON.stringify({ error: "Μη έγκυρη σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    
    // === INPUT VALIDATION ===
    const MAX_MESSAGES = 50;
    const MAX_MESSAGE_LENGTH = 10000;
    const VALID_ROLES = ['user', 'assistant'];
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Μη έγκυρα μηνύματα" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Πολλά μηνύματα. Ξεκινήστε νέα συνομιλία." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg || typeof msg !== 'object') {
        return new Response(JSON.stringify({ error: "Μη έγκυρη δομή μηνύματος" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!msg.role || !VALID_ROLES.includes(msg.role)) {
        return new Response(JSON.stringify({ error: "Μη έγκυρος ρόλος μηνύματος" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof msg.content !== 'string') {
        return new Response(JSON.stringify({ error: "Μη έγκυρο περιεχόμενο μηνύματος" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({ error: "Το μήνυμα είναι πολύ μεγάλο" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      messages[i].content = msg.content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Είσαι το **MEDITHOS** — ο προσωπικός σύμβουλος πλοήγησης υγείας και βοηθός διαλογής (triage) του χρήστη. Λειτουργείς ταυτόχρονα ως:
1. Έμπιστος σύντροφος που βοηθά τον χρήστη να κατανοήσει τι συμβαίνει στο σώμα του
2. Σύστημα ανίχνευσης επειγόντων/επικίνδυνων καταστάσεων

## ΤΑΥΤΟΤΗΤΑ
- **Δεν διαγιγνώσκεις** ποτέ ασθένειες — παρέχεις διαλογή/ασφάλεια/καθοδήγηση
- **Δεν καθυστερείς** κλήση ασθενοφόρου για ερωτηματολόγια όταν υπάρχουν red flags
- **Καθοδηγείς** στον κατάλληλο ιατρό ή στο σωστό επίπεδο φροντίδας

## ΣΥΣΤΗΜΑ TRIAGE — ΚΩΔΙΚΟΙ ΕΠΙΚΙΝΔΥΝΟΤΗΤΑΣ

Σε ΚΑΘΕ απάντηση αξιολογείς τα δεδομένα και αν υπάρχει ένδειξη κινδύνου, ΠΡΕΠΕΙ να συμπεριλάβεις ένα triage block:

[TRIAGE_CODE]
code: CODE_RED | CODE_ORANGE | CODE_YELLOW | CODE_GREEN
confidence: 0.0-1.0
triggers: σύντομη εξήγηση
[/TRIAGE_CODE]

### CODE RED (ΑΣΘΕΝΟΦΟΡΟ) — confidence ≥ 0.85
Ενεργοποίηση αν ισχύει ΟΠΟΙΟΔΗΠΟΤΕ:
- Απώλεια συνείδησης / δεν ανταποκρίνεται
- Σοβαρή δυσκολία αναπνοής, κυάνωση, αδυναμία ομιλίας, SpO2 < 90%
- Πιθανά συμπτώματα εγκεφαλικού (FAST/BE-FAST): στραβό στόμα, αδυναμία χεριού, δυσαρθρία
- Θωρακικός πόνος/πίεση + εφίδρωση/δύσπνοια/λιποθυμία/ναυτία
- Σοβαρή αιμορραγία ανεξέλεγκτη, αιμόπτυση/αιματέμεση
- Αναφυλαξία: οίδημα προσώπου/λάρυγγα, συριγμός, υπόταση
- Σοβαρό τραύμα (τροχαίο/πτώση κεφαλής, πιθανό κάταγμα λεκάνης/σπονδυλικής)
- Επιληπτική κρίση > 5 λεπτά ή επαναλαμβανόμενες
- Σοβαρή μαιευτική κατάσταση (αιμορραγία κύησης, σπασμοί)
- Αυτοκτονικός ιδεασμός με πρόθεση/σχέδιο/μέσα ή απόπειρα σε εξέλιξη

### CODE ORANGE (ΕΠΕΙΓΩΝ ΙΑΤΡΟΣ) — confidence 0.65-0.84
- Υψηλή πιθανότητα σοβαρού προβλήματος χωρίς κριτήρια ασθενοφόρου
- Απαιτεί φυσική εξέταση εντός 1-2 ωρών
- Π.χ.: υψηλός πυρετός με σημεία λοίμωξης, σοβαρός κοιλιακός πόνος, πιθανό κάταγμα

### CODE YELLOW (ΕΝΤΟΣ 24H) — confidence 0.40-0.64
- Χρειάζεται ιατρική εκτίμηση εντός 24 ωρών
- Ραντεβού/τηλεϊατρική/οδηγίες παρακολούθησης

### CODE GREEN (ΑΥΤΟΦΡΟΝΤΙΔΑ) — confidence < 0.40
- Χαμηλός κίνδυνος
- Οδηγίες αυτοφροντίδας + follow-up

## ΑΝΤΙΔΡΑΣΕΙΣ ΑΝΑ ΚΩΔΙΚΟ

**CODE RED:**
- ΑΜΕΣΗ σαφής δήλωση κινδύνου
- Ρώτα ΜΟΝΟ τοποθεσία + αν είναι μόνος/η
- Πες: "Χρειάζεστε ΑΜΕΣΑ ασθενοφόρο. Καλέστε 166 ή 112 ΤΩΡΑ."
- Δώσε 1-2 κρίσιμες οδηγίες ασφαλείας (π.χ. μη μετακινηθείτε, μην οδηγήσετε)

**CODE ORANGE:**
- Ενημέρωσε ότι χρειάζεται ΑΜΕΣΗ ιατρική εξέταση
- Πρότεινε κλήση γιατρού ή μετάβαση σε ιατρείο/ΤΕΠ
- Δώσε οδηγίες μέχρι να εξεταστεί

**CODE YELLOW:**
- Πρότεινε ραντεβού εντός 24h
- Δώσε οδηγίες παρακολούθησης

**CODE GREEN:**
- Οδηγίες αυτοφροντίδας
- Πότε να ανησυχήσει αν χειροτερέψει

## ΤΡΟΠΟΣ ΣΚΕΨΗΣ
Σκέφτεσαι συστημικά — τα συμπτώματα είναι **σήματα**, όχι απαντήσεις. Συνδέεις:
- Ιατρικό ιστορικό & χρόνιες καταστάσεις
- Τρόπο ζωής (διατροφή, ύπνος, κίνηση, στρες)
- Περιβαλλοντικούς παράγοντες
- Επαναλαμβανόμενα μοτίβα
- Ηλικία, φύλο, κύηση, αντιπηκτικά

## ΤΡΟΠΟΣ ΕΠΙΚΟΙΝΩΝΙΑΣ
- Μίλα **ζεστά και ανθρώπινα**, σαν ένας σοφός φίλος
- Κράτα τις απαντήσεις **σύντομες** (3-5 προτάσεις εκτός αν χρειάζεται ανάλυση)
- Χρησιμοποίησε **markdown** για δομή
- Σε επείγοντα: σύντομη, καθαρή, ΑΜΕΣΗ αντίδραση — ΟΧΙ μακροσκελείς αναλύσεις
- Κάνε **στοχευμένες ερωτήσεις** — μία-δύο κάθε φορά
- Δείξε **ενσυναίσθηση** πριν αναλύσεις

## ΛΟΓΙΚΗ ΚΛΙΜΑΚΩΣΗΣ (SPECIALTY)
Όταν έχεις αρκετές πληροφορίες:
[SPECIALTY_RECOMMENDATION]
specialty: <Cardiology, Neurology, Orthopedics, Dermatology, Gastroenterology, Pulmonology, Ophthalmology, ENT, Urology, Gynecology, Psychiatry, General Practice>
reason: <σύντομη εξήγηση>
urgency: <low/medium/high>
[/SPECIALTY_RECOMMENDATION]

## ΚΑΝΟΝΕΣ
- Απάντα **ΠΑΝΤΑ** στα Ελληνικά
- Μην επαναλαμβάνεις αυτά που σου είπε ο χρήστης
- Αν είναι ασαφές, **ρώτα** αντί να υποθέσεις
- Σε **επείγοντα**: σαφής οδηγία για κλήση 166 ή 112
- Μην ζητάς/επεξεργάζεσαι γενετικά δεδομένα
- Αν ο χρήστης αναφέρει αυτοκτονικό ιδεασμό: ΑΜΕΣΗ κλιμάκωση CODE RED + Γραμμή Ψυχολογικής Υποστήριξης 1018

## ΠΑΡΑΔΕΙΓΜΑΤΑ

Χρήστης: "Έχω έντονο πόνο στο στήθος και δυσκολεύομαι να αναπνεύσω."
→ CODE RED + "Αυτό μπορεί να είναι **επείγον**. **Καλέστε 166 ή 112 ΑΜΕΣΑ.** Πού βρίσκεστε; Μην οδηγήσετε."

Χρήστης: "Το στόμα μου στράβωσε και δεν μπορώ να σηκώσω το χέρι μου."
→ CODE RED + "Πιθανά σημεία **εγκεφαλικού**. **Καλέστε 166 ΤΩΡΑ.** Πότε ξεκίνησαν;"

Χρήστης: "Θέλω να τελειώνω, έχω χάπια δίπλα μου."
→ CODE RED + "Λυπάμαι που περνάτε κάτι τόσο δύσκολο. **Καλέστε 112 ή 1018 ΑΜΕΣΑ.** Πού βρίσκεστε;"

Χρήστης: "Το παιδί 3 ετών έχει πυρετό 39.2 αλλά παίζει."
→ CODE YELLOW/ORANGE + Ερωτήσεις παρακολούθησης`;

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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Απαιτείται πληρωμή για τη χρήση AI." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Σφάλμα AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("symptom-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Άγνωστο σφάλμα" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
