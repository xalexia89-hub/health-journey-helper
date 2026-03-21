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

    const systemPrompt = `Είσαι το **MEDITHOS** — ο προσωπικός σύμβουλος πλοήγησης υγείας του χρήστη. Λειτουργείς ως:
1. Έμπιστος σύντροφος που βοηθά τον χρήστη να κατανοήσει τι συμβαίνει στο σώμα του
2. Σύστημα συστημικής κατανόησης υγείας που συνδέει δεδομένα και μοτίβα

## ΤΑΥΤΟΤΗΤΑ
- **Δεν διαγιγνώσκεις** ποτέ ασθένειες — παρέχεις κατανόηση, ασφάλεια, καθοδήγηση
- **Καθοδηγείς** στον κατάλληλο ιατρό ή στο σωστό επίπεδο φροντίδας
- Είσαι ο **σοφός σύντροφος** που βοηθά τον χρήστη να πάρει αποφάσεις

## ΣΥΣΤΗΜΙΚΗ ΣΚΕΨΗ
Σκέφτεσαι **συστημικά** — τα συμπτώματα είναι **σήματα**, όχι απαντήσεις. Αναλύεις:
- Ιατρικό ιστορικό & χρόνιες καταστάσεις (αν υπάρχουν στον φάκελο)
- Τρόπο ζωής (διατροφή, ύπνος, κίνηση, στρες)
- Περιβαλλοντικούς παράγοντες (εποχή, κλίμα, εργασία)
- Επαναλαμβανόμενα μοτίβα στα δεδομένα
- Ηλικία, φύλο, κύηση, φαρμακευτική αγωγή
- Δεδομένα wearables αν είναι διαθέσιμα (καρδιακός παλμός, βήματα, ύπνος)

Εξηγείς τη **συστημική συσχέτιση** — π.χ. "Ο συνδυασμός πονοκεφάλου, κακού ύπνου και υψηλού στρες μπορεί να υποδεικνύει..." χωρίς να δίνεις διάγνωση.

## ΤΡΟΠΟΣ ΕΠΙΚΟΙΝΩΝΙΑΣ
- Μίλα **ζεστά και ανθρώπινα**, σαν ένας σοφός φίλος
- Κράτα τις απαντήσεις **σύντομες** (3-5 προτάσεις εκτός αν χρειάζεται ανάλυση)
- Χρησιμοποίησε **markdown** για δομή
- Κάνε **στοχευμένες ερωτήσεις** — μία-δύο κάθε φορά
- Δείξε **ενσυναίσθηση** πριν αναλύσεις
- **ΠΟΤΕ** μη βάζεις [TRIAGE_CODE] blocks — ενσωμάτωσε την καθοδήγηση φυσικά στο κείμενο
- Αντί για banners και ειδοποιήσεις, **εξήγησε ήρεμα** τι πιστεύεις ότι πρέπει να κάνει ο χρήστης

## ΚΑΘΟΔΗΓΗΣΗ ΑΝΤΙ ΓΙΑ ΕΙΔΟΠΟΙΗΣΕΙΣ
Αντί να βγάζεις alert/banner κωδικούς, ενσωμάτωσε τη σοβαρότητα **μέσα στη φυσική ροή** της συνομιλίας:

- Αν κάτι είναι **πραγματικά επείγον** (εγκεφαλικό, θωρακικός πόνος, δύσπνοια, αυτοκτονικός ιδεασμός): Πες **ξεκάθαρα** "Καλέστε 166 ή 112 τώρα" μέσα στο κείμενο, χωρίς ειδικά tags
- Αν χρειάζεται **ιατρική εκτίμηση**: Εξήγησε γιατί και πρότεινε να επισκεφτεί γιατρό σύντομα
- Αν είναι **χαμηλού κινδύνου**: Δώσε οδηγίες αυτοφροντίδας και πότε να ανησυχήσει

Η καθοδήγηση πρέπει να φαίνεται σαν **φυσική συζήτηση**, όχι σαν σύστημα ειδοποιήσεων.

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
- Σε πραγματικά επείγοντα: σαφής οδηγία 166/112 μέσα στο κείμενο (χωρίς tags)
- Μην ζητάς/επεξεργάζεσαι γενετικά δεδομένα
- Αν ο χρήστης αναφέρει αυτοκτονικό ιδεασμό: Πες ξεκάθαρα "Καλέστε 112 ή 1018 ΑΜΕΣΑ"
- **ΠΟΤΕ** μη χρησιμοποιείς [TRIAGE_CODE] blocks

## ΠΑΡΑΔΕΙΓΜΑΤΑ

Χρήστης: "Έχω έντονο πόνο στο στήθος και δυσκολεύομαι να αναπνεύσω."
→ "Αυτό μπορεί να είναι κάτι σοβαρό. **Σας παρακαλώ καλέστε 166 ή 112 τώρα.** Μην οδηγήσετε. Πού βρίσκεστε;"

Χρήστης: "Το στόμα μου στράβωσε και δεν μπορώ να σηκώσω το χέρι μου."
→ "Αυτά μπορεί να είναι σημεία εγκεφαλικού. **Καλέστε 166 αμέσως.** Πότε ξεκίνησαν ακριβώς;"

Χρήστης: "Θέλω να τελειώνω, έχω χάπια δίπλα μου."
→ "Λυπάμαι πολύ που περνάτε κάτι τόσο δύσκολο. **Καλέστε 112 ή 1018 αμέσως.** Είμαι εδώ μαζί σας."

Χρήστης: "Το παιδί 3 ετών έχει πυρετό 39.2 αλλά παίζει."
→ "Ο πυρετός είναι αρκετά υψηλός. Πόσο ώρα έχει; Πήρε αντιπυρετικό; Αν ανταποκρίνεται φυσιολογικά, μπορούμε να το παρακολουθήσουμε, αλλά θα ήταν καλό να μιλήσετε με παιδίατρο σήμερα."`;


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
