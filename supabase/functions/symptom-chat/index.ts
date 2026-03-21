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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Σφάλμα διαμόρφωσης" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth client to get user
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Μη έγκυρη σύνδεση" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service client for fetching medical data
    const serviceClient = supabaseServiceKey 
      ? createClient(supabaseUrl, supabaseServiceKey)
      : authClient;

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

    // === FETCH USER MEDICAL CONTEXT ===
    let medicalContext = "";
    try {
      // Fetch health file (age, sex, lifestyle)
      const { data: healthFile } = await serviceClient
        .from('health_files')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch medical records (conditions, medications, allergies)
      const { data: medicalRecord } = await serviceClient
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch recent symptom entries
      const { data: recentSymptoms } = await serviceClient
        .from('symptom_entries')
        .select('ai_summary, body_areas, urgency_level, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (healthFile) {
        const age = healthFile.date_of_birth 
          ? Math.floor((Date.now() - new Date(healthFile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : null;
        
        medicalContext += `\n## ΔΕΔΟΜΕΝΑ ΧΡΗΣΤΗ\n`;
        if (age) medicalContext += `- Ηλικία: ${age} ετών\n`;
        if (healthFile.sex) medicalContext += `- Φύλο: ${healthFile.sex === 'male' ? 'Άνδρας' : healthFile.sex === 'female' ? 'Γυναίκα' : healthFile.sex}\n`;
        if (healthFile.height_cm) medicalContext += `- Ύψος: ${healthFile.height_cm} cm\n`;
        if (healthFile.weight_kg) medicalContext += `- Βάρος: ${healthFile.weight_kg} kg\n`;
        if (healthFile.smoking_status) medicalContext += `- Κάπνισμα: ${healthFile.smoking_status}\n`;
        if (healthFile.activity_level) medicalContext += `- Δραστηριότητα: ${healthFile.activity_level}\n`;
        if (healthFile.blood_pressure_systolic && healthFile.blood_pressure_diastolic) {
          medicalContext += `- Αρτηριακή Πίεση: ${healthFile.blood_pressure_systolic}/${healthFile.blood_pressure_diastolic}\n`;
        }
      }

      if (medicalRecord) {
        medicalContext += `\n## ΙΑΤΡΙΚΟ ΙΣΤΟΡΙΚΟ\n`;
        if (medicalRecord.chronic_conditions?.length) {
          medicalContext += `- Χρόνιες Παθήσεις: ${medicalRecord.chronic_conditions.join(', ')}\n`;
        }
        if (medicalRecord.current_medications?.length) {
          medicalContext += `- Τρέχοντα Φάρμακα: ${medicalRecord.current_medications.join(', ')}\n`;
        }
        if (medicalRecord.allergies?.length) {
          medicalContext += `- Αλλεργίες: ${medicalRecord.allergies.join(', ')}\n`;
        }
        if (medicalRecord.past_surgeries?.length) {
          medicalContext += `- Χειρουργεία: ${medicalRecord.past_surgeries.join(', ')}\n`;
        }
      }

      if (recentSymptoms && recentSymptoms.length > 0) {
        medicalContext += `\n## ΠΡΟΣΦΑΤΑ ΣΥΜΠΤΩΜΑΤΑ\n`;
        for (const s of recentSymptoms) {
          const date = new Date(s.created_at).toLocaleDateString('el-GR');
          medicalContext += `- [${date}] Περιοχές: ${s.body_areas?.join(', ') || 'Μη καθορισμένο'}, Επείγον: ${s.urgency_level || 'Μη καθορισμένο'}\n`;
        }
      }
    } catch (ctxError) {
      console.error("Error fetching medical context:", ctxError);
      // Continue without context
    }

    // === SYSTEM PROMPT ===
    const systemPrompt = `Είσαι το **MEDITHOS AI** — ένας ιατρικός βοηθός καθοδήγησης (triage system).

## ΡΟΛΟΣ
- Κατανοείς συμπτώματα χρηστών
- Κάνεις στοχευμένες ερωτήσεις για να συγκεντρώσεις πληροφορίες
- Αξιολογείς επίπεδο κινδύνου (χαμηλό, μέτριο, υψηλό, επείγον)
- Καθοδηγείς τον χρήστη στο επόμενο βήμα
- Σκέφτεσαι **συστημικά** — τα συμπτώματα είναι σήματα, αναλύεις αλληλεπιδράσεις

## ΚΑΝΟΝΕΣ
- **Δεν δίνεις ΠΟΤΕ οριστική διάγνωση**
- Δεν αντικαθιστάς γιατρό
- Δεν προτείνεις επικίνδυνες θεραπείες
- Αν υπάρχει πιθανός κίνδυνος, **αυξάνεις** την προτεραιότητα
- Αν είναι ασαφές, **ρώτα** αντί να υποθέσεις
- Απάντα **ΠΑΝΤΑ** στα Ελληνικά
- Μην ζητάς/επεξεργάζεσαι γενετικά δεδομένα

## RED FLAGS (πάντα υψηλός κίνδυνος / επείγον)
- Πόνος στο στήθος
- Δύσπνοια
- Λιποθυμία ή σύγχυση
- Παράλυση ή μούδιασμα μισού σώματος
- Έντονος αιφνίδιος πόνος
- Αιμορραγία
- Υψηλός πυρετός (>39°C) με αδυναμία
- Νευρολογικά συμπτώματα (στραβό στόμα, αδυναμία λόγου)
- Αυτοκτονικός ιδεασμός

## ΔΟΜΗ ΑΠΑΝΤΗΣΗΣ
Ακολούθησε αυτή τη ροή φυσικά στο κείμενο (χωρίς banners, tags ή alerts):
1. **Κατανόηση**: "Καταλαβαίνω ότι…"
2. **Εκτίμηση**: "Αυτό μπορεί να χρειάζεται…"
3. **Ερώτηση** (αν χρειάζεται): στοχευμένη, 1-2 ερωτήσεις
4. **Καθοδήγηση**: "Προτείνεται να…"

## ΕΠΕΙΓΟΝΤΑ
Αν εντοπιστεί RED FLAG:
- Πες **ξεκάθαρα** μέσα στο κείμενο: "**Καλέστε 166 ή 112 τώρα**"
- Μην καθυστερείς με ερωτήσεις — πρώτα η ασφάλεια
- Αν αναφέρει αυτοκτονικό ιδεασμό: "**Καλέστε 112 ή 1018 ΑΜΕΣΑ**"

## ΣΥΣΤΗΜΙΚΗ ΣΚΕΨΗ
Αναλύεις τα συμπτώματα ως **σύστημα**, λαμβάνοντας υπόψη:
- Ιατρικό ιστορικό & χρόνιες καταστάσεις
- Τρέχοντα φάρμακα & αλληλεπιδράσεις
- Τρόπο ζωής (ύπνος, στρες, κίνηση, διατροφή)
- Ηλικία, φύλο, κύηση
- Επαναλαμβανόμενα μοτίβα
- Δεδομένα wearables αν υπάρχουν

Εξηγείς τη **συστημική συσχέτιση** — π.χ. "Ο συνδυασμός πονοκεφάλου, κακού ύπνου και υψηλού στρες μπορεί να υποδεικνύει..." χωρίς να δίνεις διάγνωση.

## ΤΟΝΟΣ
- Ήρεμος, καθαρός, υποστηρικτικός
- Σοβαρός όταν χρειάζεται
- Ζεστός και ανθρώπινος — σαν σοφός σύντροφος
- Σύντομες απαντήσεις (3-5 προτάσεις) εκτός αν χρειάζεται ανάλυση

## ΜΟΡΦΟΠΟΙΗΣΗ
- Χρησιμοποίησε **markdown** για δομή
- **ΠΟΤΕ** μη βάζεις [TRIAGE_CODE], [ALERT] ή οποιοδήποτε structured tag/banner
- Ενσωμάτωσε τη σοβαρότητα **μέσα στη φυσική ροή** του κειμένου

## SPECIALTY RECOMMENDATION
Όταν έχεις αρκετές πληροφορίες για να προτείνεις ειδικότητα:
[SPECIALTY_RECOMMENDATION]
specialty: <ειδικότητα>
reason: <σύντομη εξήγηση>
urgency: <low/medium/high>
[/SPECIALTY_RECOMMENDATION]
${medicalContext ? `\n## ΙΑΤΡΙΚΟΣ ΦΑΚΕΛΟΣ ΧΡΗΣΤΗ\nΠροσάρμοσε τις απαντήσεις σου με βάση αυτά τα δεδομένα:\n${medicalContext}` : ''}`;


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
