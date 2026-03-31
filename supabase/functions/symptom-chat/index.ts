import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// === HELPER: Fetch wellness & medical context ===
async function fetchFullContext(client: any, userId: string): Promise<string> {
  let ctx = "";

  try {
    // 1. Health file (demographics, lifestyle)
    const { data: hf } = await client
      .from('health_files').select('*').eq('user_id', userId).maybeSingle();

    if (hf) {
      const age = hf.date_of_birth
        ? Math.floor((Date.now() - new Date(hf.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null;
      ctx += `\n## ΔΗΜΟΓΡΑΦΙΚΑ & LIFESTYLE\n`;
      if (age) ctx += `- Ηλικία: ${age} ετών\n`;
      if (hf.sex) ctx += `- Φύλο: ${hf.sex === 'male' ? 'Άνδρας' : hf.sex === 'female' ? 'Γυναίκα' : hf.sex}\n`;
      if (hf.height_cm) ctx += `- Ύψος: ${hf.height_cm} cm\n`;
      if (hf.weight_kg) ctx += `- Βάρος: ${hf.weight_kg} kg\n`;
      if (hf.height_cm && hf.weight_kg) {
        const bmi = (hf.weight_kg / ((hf.height_cm / 100) ** 2)).toFixed(1);
        ctx += `- BMI: ${bmi}\n`;
      }
      if (hf.smoking_status) ctx += `- Κάπνισμα: ${hf.smoking_status}\n`;
      if (hf.alcohol_consumption) ctx += `- Αλκοόλ: ${hf.alcohol_consumption}\n`;
      if (hf.activity_level) ctx += `- Επίπεδο δραστηριότητας: ${hf.activity_level}\n`;
      if (hf.blood_pressure_systolic && hf.blood_pressure_diastolic) {
        ctx += `- Αρτηριακή πίεση (τελευταία): ${hf.blood_pressure_systolic}/${hf.blood_pressure_diastolic}\n`;
      }
    }

    // 2. Medical record (conditions, meds, allergies, surgeries, family)
    const { data: mr } = await client
      .from('medical_records').select('*').eq('user_id', userId).maybeSingle();

    if (mr) {
      ctx += `\n## ΙΑΤΡΙΚΟ ΙΣΤΟΡΙΚΟ\n`;
      if (mr.chronic_conditions?.length) ctx += `- Χρόνιες παθήσεις: ${mr.chronic_conditions.join(', ')}\n`;
      if (mr.current_medications?.length) ctx += `- Τρέχοντα φάρμακα: ${mr.current_medications.join(', ')}\n`;
      if (mr.allergies?.length) ctx += `- Αλλεργίες: ${mr.allergies.join(', ')}\n`;
      if (mr.past_surgeries?.length) ctx += `- Χειρουργεία: ${mr.past_surgeries.join(', ')}\n`;
      if (mr.family_history) ctx += `- Οικογενειακό ιστορικό: ${JSON.stringify(mr.family_history)}\n`;
      if (mr.notes) ctx += `- Σημειώσεις: ${mr.notes}\n`;
    }

    // 3. Recent symptom entries (last 5)
    const { data: symptoms } = await client
      .from('symptom_entries')
      .select('ai_summary, body_areas, urgency_level, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (symptoms?.length) {
      ctx += `\n## ΠΡΟΣΦΑΤΑ ΣΥΜΠΤΩΜΑΤΑ (ιστορικό αναζήτησης)\n`;
      for (const s of symptoms) {
        const d = new Date(s.created_at).toLocaleDateString('el-GR');
        ctx += `- [${d}] Περιοχές: ${s.body_areas?.join(', ') || '—'}, Επείγον: ${s.urgency_level || '—'}`;
        if (s.ai_summary) ctx += `, Σύνοψη: ${s.ai_summary.slice(0, 120)}`;
        ctx += `\n`;
      }
    }

    // 4. Wearable data (last 7 days aggregates)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [hrRes, stepsRes, spo2Res, bpRes] = await Promise.all([
      client.from('wearable_heart_rate').select('bpm, measured_at')
        .eq('user_id', userId).gte('measured_at', weekAgo)
        .order('measured_at', { ascending: false }).limit(50),
      client.from('wearable_steps').select('step_count, recorded_at')
        .eq('user_id', userId).gte('recorded_at', weekAgo)
        .order('recorded_at', { ascending: false }).limit(14),
      client.from('wearable_spo2').select('spo2_value, measured_at')
        .eq('user_id', userId).gte('measured_at', weekAgo)
        .order('measured_at', { ascending: false }).limit(14),
      client.from('wearable_blood_pressure').select('systolic, diastolic, measured_at')
        .eq('user_id', userId).order('measured_at', { ascending: false }).limit(3),
    ]);

    const hasWearable = hrRes.data?.length || stepsRes.data?.length || spo2Res.data?.length || bpRes.data?.length;
    if (hasWearable) {
      ctx += `\n## ΔΕΔΟΜΕΝΑ WEARABLE (τελευταίες 7 ημέρες)\n`;
      if (hrRes.data?.length) {
        const avg = Math.round(hrRes.data.reduce((s: number, r: any) => s + r.bpm, 0) / hrRes.data.length);
        const max = Math.max(...hrRes.data.map((r: any) => r.bpm));
        const min = Math.min(...hrRes.data.map((r: any) => r.bpm));
        ctx += `- Καρδιακός παλμός: μ.ό. ${avg} bpm, εύρος ${min}–${max} bpm\n`;
      }
      if (stepsRes.data?.length) {
        const avg = Math.round(stepsRes.data.reduce((s: number, r: any) => s + r.step_count, 0) / stepsRes.data.length);
        ctx += `- Βήματα/ημέρα: μ.ό. ${avg}\n`;
      }
      if (spo2Res.data?.length) {
        const avg = (spo2Res.data.reduce((s: number, r: any) => s + r.spo2_value, 0) / spo2Res.data.length).toFixed(1);
        ctx += `- SpO2: μ.ό. ${avg}%\n`;
      }
      if (bpRes.data?.length) {
        const latest = bpRes.data[0];
        ctx += `- Αρτηριακή πίεση (πρόσφατη): ${latest.systolic}/${latest.diastolic}\n`;
      }
    }

    // 5. Sleep logs (last 7 days)
    const { data: sleepLogs } = await client
      .from('sleep_logs').select('duration_hours, quality, logged_at')
      .eq('user_id', userId).gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false }).limit(7);

    if (sleepLogs?.length) {
      const avgSleep = (sleepLogs.reduce((s: number, r: any) => s + (r.duration_hours || 0), 0) / sleepLogs.length).toFixed(1);
      ctx += `\n## ΥΠΝΟΣ (τελευταίες 7 ημέρες)\n`;
      ctx += `- Μ.Ό. ωρών ύπνου: ${avgSleep}\n`;
      const qualities = sleepLogs.filter((r: any) => r.quality).map((r: any) => r.quality);
      if (qualities.length) ctx += `- Ποιότητα: ${qualities.join(', ')}\n`;
    }

    // 6. Stress logs (last 7 days)
    const { data: stressLogs } = await client
      .from('stress_logs').select('stress_level, trigger_description, logged_at')
      .eq('user_id', userId).gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false }).limit(7);

    if (stressLogs?.length) {
      const avgStress = (stressLogs.reduce((s: number, r: any) => s + (r.stress_level || 0), 0) / stressLogs.length).toFixed(1);
      ctx += `\n## ΣΤΡΕΣ (τελευταίες 7 ημέρες)\n`;
      ctx += `- Μ.Ό. επίπεδο στρες: ${avgStress}/10\n`;
      const triggers = stressLogs.filter((r: any) => r.trigger_description).map((r: any) => r.trigger_description);
      if (triggers.length) ctx += `- Πρόσφατοι παράγοντες: ${triggers.slice(0, 3).join('; ')}\n`;
    }

    // 7. Activity logs (last 7 days)
    const { data: actLogs } = await client
      .from('activity_logs').select('activity_type, duration_minutes, calories_burned, intensity, logged_at')
      .eq('user_id', userId).gte('logged_at', weekAgo)
      .order('logged_at', { ascending: false }).limit(10);

    if (actLogs?.length) {
      const totalMin = actLogs.reduce((s: number, r: any) => s + (r.duration_minutes || 0), 0);
      ctx += `\n## ΔΡΑΣΤΗΡΙΟΤΗΤΑ (τελευταίες 7 ημέρες)\n`;
      ctx += `- Συνολικά λεπτά άσκησης: ${totalMin}\n`;
      ctx += `- Τύποι: ${[...new Set(actLogs.map((r: any) => r.activity_type))].join(', ')}\n`;
    }

    // 8. Nutrition (latest profile)
    const { data: nutrProfile } = await client
      .from('nutrition_profiles').select('*').eq('user_id', userId).maybeSingle();

    if (nutrProfile) {
      ctx += `\n## ΔΙΑΤΡΟΦΗ\n`;
      if (nutrProfile.daily_calorie_target) ctx += `- Στόχος θερμίδων: ${nutrProfile.daily_calorie_target}\n`;
      if (nutrProfile.water_target_ml) ctx += `- Στόχος νερού: ${nutrProfile.water_target_ml} ml\n`;
      if (nutrProfile.dietary_restrictions?.length) ctx += `- Περιορισμοί: ${nutrProfile.dietary_restrictions.join(', ')}\n`;
    }

    // 9. Recent appointments (upcoming or recent)
    const { data: appts } = await client
      .from('appointments')
      .select('appointment_date, appointment_time, status, visit_type, notes')
      .eq('patient_id', userId)
      .gte('appointment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('appointment_date', { ascending: false })
      .limit(3);

    if (appts?.length) {
      ctx += `\n## ΡΑΝΤΕΒΟΥ (πρόσφατα/επερχόμενα)\n`;
      for (const a of appts) {
        ctx += `- ${a.appointment_date} ${a.appointment_time}: ${a.visit_type || 'Επίσκεψη'} (${a.status})\n`;
      }
    }

    // 10. Medication reminders (active)
    const { data: meds } = await client
      .from('medication_reminders')
      .select('medication_name, dosage, frequency, reminder_times')
      .eq('user_id', userId).eq('is_active', true).limit(10);

    if (meds?.length) {
      ctx += `\n## ΕΝΕΡΓΕΣ ΥΠΕΝΘΥΜΙΣΕΙΣ ΦΑΡΜΑΚΩΝ\n`;
      for (const m of meds) {
        ctx += `- ${m.medication_name} ${m.dosage || ''} (${m.frequency})\n`;
      }
    }

  } catch (err) {
    console.error("Error fetching context:", err);
  }

  return ctx;
}

// === SYSTEM PROMPT ===
function buildSystemPrompt(medicalContext: string): string {
  return `Είσαι το **MEDITHOS AI** — ο Συνδεδεμένος Σύντροφος Υγείας (Connected Health Companion).

## ΤΑΥΤΟΤΗΤΑ
Είσαι ένας εξαιρετικά ευφυής, προσωπικός καθοδηγητής υγείας μέσα στην πλατφόρμα Medithos.
Δεν είσαι chatbot. Σκέφτεσαι σαν **συνδεδεμένο σύστημα υγείας** που βλέπει ολόκληρη την εικόνα του χρήστη.

## ΤΙ ΕΧΕΙΣ ΠΡΟΣΒΑΣΗ
Έχεις πρόσβαση σε:
- **Ιατρικό φάκελο**: χρόνιες παθήσεις, φάρμακα, αλλεργίες, χειρουργεία, οικογενειακό ιστορικό
- **Wellness δεδομένα (wearables)**: καρδιακός παλμός, βήματα, SpO2, αρτηριακή πίεση, τάσεις
- **Ύπνος**: ώρες, ποιότητα, μοτίβα
- **Στρες**: επίπεδα, παράγοντες, εξέλιξη
- **Δραστηριότητα**: τύπος, ένταση, διάρκεια
- **Διατροφή**: στόχοι, περιορισμοί
- **Συμπεριφορά στην πλατφόρμα**: τι ψάχνει ο χρήστης, πόσο συχνά, ποιες περιοχές σώματος επιλέγει, πρόσφατα συμπτώματα
- **Ραντεβού & φάρμακα**: ενεργές υπενθυμίσεις, επερχόμενες επισκέψεις

## ΠΩΣ ΣΚΕΦΤΕΣΑΙ
Κάθε φορά που ο χρήστης μιλάει, ακολουθείς αυτή τη διαδικασία:

1. **Ενεργή ακρόαση**: Κατανόησε τι λέει ο χρήστης — αλλά και τι ΔΕΝ λέει. Τι κρύβεται πίσω από την ερώτηση;
2. **Σύνθεση δεδομένων**: Συνδύασε τα τρέχοντα συμπτώματα με:
   - Ιατρικό ιστορικό (υπάρχουσες παθήσεις, φάρμακα, αλλεργίες)
   - Wellness μοτίβα (ύπνος, στρες, δραστηριότητα τελευταίων ημερών)
   - Wearable δεδομένα (τάσεις καρδιακού ρυθμού, SpO2, πίεσης)
   - Συμπεριφορά πλατφόρμας (τι ψάχνει επανειλημμένα; φαίνεται ανήσυχος;)
3. **Εντόπισε μοτίβα**: Ψάξε συσχετίσεις (π.χ. αυξημένο στρες + λίγος ύπνος + πονοκέφαλοι = πιθανή σωματοποίηση στρες)
4. **Αξιολόγησε κίνδυνο**: χαμηλός / μέτριος / χρειάζεται προσοχή / επείγον
5. **Πρότεινε βέλτιστη επόμενη πράξη**: Τι ακριβώς πρέπει να κάνει ο χρήστης ΤΩΡΑ

## ΒΕΛΤΙΣΤΗ ΕΠΟΜΕΝΗ ΠΡΑΞΗ
Πάντα καταλήγεις σε μια **συγκεκριμένη, εφαρμόσιμη πρόταση**:
- 🏥 «Πρότεινε να κλείσεις ραντεβού με [ειδικότητα] μέσα στο Medithos»
- 📋 «Πες στον γιατρό σου ακριβώς αυτό: [τι να ρωτήσει]»
- 🧘 «Δοκίμασε αυτή την τεχνική αναπνοής/χαλάρωσης»
- 💊 «Μην αλλάξεις φαρμακευτική αγωγή — ζήτα πρώτα από τον ιατρό σου»
- 📊 «Παρακολούθησε αυτό το σύμπτωμα για 48 ώρες και ξανα-έλα»
- 🚨 «Πήγαινε αμέσως στα Επείγοντα ή κάλεσε 166/112»

## ΚΑΝΟΝΕΣ
- **ΠΟΤΕ** δεν δίνεις οριστική διάγνωση
- **ΠΟΤΕ** δεν προτείνεις αλλαγή φαρμάκων ή δόσεων
- **ΠΟΤΕ** δεν αντικαθιστάς γιατρό
- **ΠΟΤΕ** δεν δημιουργείς πανικό
- **ΠΟΤΕ** δεν αγνοείς σοβαρά συμπτώματα
- Τα wellness δεδομένα τα παρουσιάζεις ως **πληροφορία πλαισίου**, όχι ως απόλυτη αλήθεια
- Αν κάτι φαίνεται ήπιο, καθησυχάζεις αλλά ΠΑΝΤΑ καθοδηγείς
- Αν ο χρήστης ψάχνει επανειλημμένα το ίδιο θέμα, αναγνώρισε την ανησυχία πίσω από τη συμπεριφορά
- Απάντα **ΠΑΝΤΑ** στα Ελληνικά
- Σεβάσου τις ρυθμίσεις απορρήτου — χρησιμοποίησε μόνο δεδομένα που σου δίνονται

## RED FLAGS (πάντα υψηλός κίνδυνος / ΑΜΕΣΟ)
- Πόνος στο στήθος
- Δύσπνοια / δυσκολία αναπνοής
- Λιποθυμία ή σύγχυση
- Παράλυση ή μούδιασμα μισού σώματος
- Έντονος αιφνίδιος πόνος
- Αιμορραγία
- Υψηλός πυρετός (>39°C) με αδυναμία
- Νευρολογικά συμπτώματα (στραβό στόμα, αδυναμία λόγου)
- Αυτοκτονικός ιδεασμός ή αυτοτραυματισμός
→ Αν εντοπιστεί RED FLAG: «**Καλέστε 166 ή 112 τώρα**» — ΑΜΕΣΑ, χωρίς καθυστέρηση
→ Αν αναφέρει αυτοκτονικό ιδεασμό: «**Καλέστε 112 ή 1018 ΑΜΕΣΑ — δεν είστε μόνοι**»

## ΔΟΜΗ ΑΠΑΝΤΗΣΗΣ
Ακολούθησε αυτή τη ροή **φυσικά στο κείμενο** (χωρίς banners, tags ή structured alerts):

1. **Κατανόηση**: «Καταλαβαίνω ότι…» — δείξε ότι κατανοείς, ΚΑΙ αυτά που δεν λέει
2. **Σύνδεση με δεδομένα**: «Κοιτώντας τον φάκελό σου / τα δεδομένα σου…» — σύνδεσε με ιστορικό, wearables, μοτίβα
3. **Ολιστική εικόνα**: Εξήγησε πώς ύπνος, στρες, δραστηριότητα, ιστορικό ΣΥΝΔΕΟΝΤΑΙ
4. **Εκτίμηση**: Χαμηλή / μέτρια / χρειάζεται προσοχή
5. **Βέλτιστο επόμενο βήμα**: Ακριβής, εφαρμόσιμη, σαφής πρόταση

## ΤΟΝΟΣ
- Ήρεμος, ευφυής, καθησυχαστικός — σαν σοφός σύντροφος υγείας
- Ζεστός, ανθρώπινος, με ενσυναίσθηση
- Δομημένος αλλά όχι ρομποτικός
- Αποφεύγεις ιατρική ορολογία εκτός αν την εξηγείς απλά
- Σύντομες απαντήσεις (3-8 προτάσεις) εκτός αν χρειάζεται βαθύτερη ανάλυση

Παράδειγμα τόνου:
"Με βάση αυτά που περιγράφεις, και βλέποντας ότι τις τελευταίες ημέρες ο ύπνος σου ήταν γύρω στις 5 ώρες ενώ το στρες σου ήταν αυξημένο, αυτό μπορεί να συνδέεται. Δεδομένου του ιστορικού σου, θα ήταν χρήσιμο να μιλήσεις σε [ειδικότητα] και να αναφέρεις τα δεδομένα που βλέπω εδώ."

## ΜΟΡΦΟΠΟΙΗΣΗ
- Χρησιμοποίησε **markdown** (bold, λίστες)
- **ΠΟΤΕ** μη βάζεις [TRIAGE_CODE], [ALERT] ή structured tags/banners
- Ενσωμάτωσε τη σοβαρότητα **μέσα στη φυσική ροή** του κειμένου

## SPECIALTY RECOMMENDATION
Όταν έχεις αρκετές πληροφορίες, πρόσθεσε:
[SPECIALTY_RECOMMENDATION]
specialty: <ειδικότητα>
reason: <σύντομη εξήγηση>
urgency: <low/medium/high>
[/SPECIALTY_RECOMMENDATION]

${medicalContext ? `\n## ΠΛΗΡΗΣ ΦΑΚΕΛΟΣ ΧΡΗΣΤΗ\nΠροσάρμοσε τις απαντήσεις σου με βάση ΟΛΑ αυτά τα δεδομένα — αναζήτησε συσχετίσεις, μοτίβα και ολιστικές συνδέσεις:\n${medicalContext}` : ''}`;
}

// === MAIN HANDLER ===
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Απαιτείται σύνδεση" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: "Σφάλμα διαμόρφωσης" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Μη έγκυρη σύνδεση" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Πολλά μηνύματα. Ξεκινήστε νέα συνομιλία." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
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

    // === FETCH FULL CONTEXT ===
    const medicalContext = await fetchFullContext(serviceClient, user.id);
    const systemPrompt = buildSystemPrompt(medicalContext);

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
    return new Response(JSON.stringify({ error: "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
