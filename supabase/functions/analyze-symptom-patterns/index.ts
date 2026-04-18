// Analyze user's symptom-search behavior to detect health-anxiety vs real concerns
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    // 1. Gather full context
    const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const since30d = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

    const [intakes7d, intakes30d, medical, recentEntries, recentDocs, hr, sleep, stress] = await Promise.all([
      supabase.from("symptom_intakes").select("id,symptoms,created_at,urgency_level").eq("user_id", user.id).gte("created_at", since7d).order("created_at", { ascending: false }),
      supabase.from("symptom_intakes").select("id,symptoms,created_at").eq("user_id", user.id).gte("created_at", since30d),
      supabase.from("medical_records").select("chronic_conditions,allergies,current_medications").eq("user_id", user.id).maybeSingle(),
      supabase.from("medical_entries").select("entry_type,title,entry_date").eq("user_id", user.id).gte("entry_date", since30d.split("T")[0]).order("entry_date", { ascending: false }).limit(20),
      supabase.from("medical_documents").select("file_name,document_category,uploaded_at").eq("user_id", user.id).gte("uploaded_at", since30d).limit(10),
      supabase.from("wearable_heart_rate").select("bpm,measured_at").eq("user_id", user.id).gte("measured_at", since7d).order("measured_at", { ascending: false }).limit(50),
      supabase.from("sleep_logs").select("quality_rating,logged_at").eq("user_id", user.id).gte("logged_at", since7d),
      supabase.from("stress_logs").select("stress_level,logged_at").eq("user_id", user.id).gte("stress_level", since7d as any),
    ]);

    const searches7d = intakes7d.data || [];
    const searches30d = intakes30d.data || [];

    // Collect symptom keywords
    const flatSymptoms7 = searches7d.flatMap((i: any) => Array.isArray(i.symptoms) ? i.symptoms : (i.symptoms ? [String(i.symptoms)] : []));
    const flatSymptoms30 = searches30d.flatMap((i: any) => Array.isArray(i.symptoms) ? i.symptoms : (i.symptoms ? [String(i.symptoms)] : []));
    const uniqueSymptoms7 = Array.from(new Set(flatSymptoms7.map((s: string) => String(s).toLowerCase().trim())));

    // Recurring (≥2 occurrences in 30d)
    const counts: Record<string, number> = {};
    flatSymptoms30.forEach((s: string) => {
      const k = String(s).toLowerCase().trim();
      if (k) counts[k] = (counts[k] || 0) + 1;
    });
    const recurring = Object.entries(counts).filter(([, n]) => n >= 2).map(([s]) => s);

    const signals = {
      search_count_7d: searches7d.length,
      search_count_30d: searches30d.length,
      unique_symptoms_7d: uniqueSymptoms7.length,
      recurring_symptoms: recurring,
      has_chronic_conditions: (medical.data?.chronic_conditions ?? []).length > 0,
      chronic_conditions: medical.data?.chronic_conditions ?? [],
      recent_diagnoses: (recentEntries.data ?? []).filter((e: any) => e.entry_type === "diagnosis").length,
      recent_uploaded_docs: (recentDocs.data ?? []).length,
      avg_heart_rate_7d: hr.data?.length ? Math.round(hr.data.reduce((a: number, x: any) => a + x.bpm, 0) / hr.data.length) : null,
      avg_sleep_quality_7d: sleep.data?.length ? Math.round((sleep.data.reduce((a: number, x: any) => a + (x.quality_rating || 0), 0) / sleep.data.length) * 10) / 10 : null,
      avg_stress_7d: stress.data?.length ? Math.round((stress.data.reduce((a: number, x: any) => a + (x.stress_level || 0), 0) / stress.data.length) * 10) / 10 : null,
    };

    // 2. Ask AI to interpret
    const prompt = `Είσαι ενσυναισθητικός κλινικός ψυχολόγος υγείας. Ανάλυσε τα δεδομένα αναζήτησης συμπτωμάτων του χρήστη και αποφάσισε αν το μοτίβο δείχνει:
- "health_anxiety": υποχονδριακό μοτίβο (πολλές αναζητήσεις διαφορετικών συμπτωμάτων χωρίς κλινικά ευρήματα, χωρίς συνέπεια)
- "real_concern": υπαρκτό κλινικό θέμα (επαναλαμβανόμενα ίδια συμπτώματα + ιατρικά ευρήματα/wearables)
- "mixed": συνδυασμός — πιθανό πραγματικό + άγχος
- "normal": φυσιολογική χρήση

ΔΕΔΟΜΕΝΑ:
${JSON.stringify(signals, null, 2)}

Επέστρεψε ΜΟΝΟ valid JSON:
{
  "pattern_type": "health_anxiety|real_concern|mixed|normal",
  "confidence": 0.0-1.0,
  "ai_summary": "1-2 προτάσεις κλινικής εκτίμησης στα Ελληνικά",
  "empathetic_message": "ζεστό, υποστηρικτικό μήνυμα 2-3 προτάσεων στα Ελληνικά (β' πρόσωπο)",
  "ai_recommendation": "συγκεκριμένη πρόταση δράσης (π.χ. ραντεβού με γενικό γιατρό, τεχνικές ηρεμίας, ψυχολόγος, παρακολούθηση συγκεκριμένου συμπτώματος)"
}

Κανόνες:
- Ποτέ μην κατηγορείς. Πάντα ζεστό, ενσυναισθητικό ύφος.
- Αν είναι health_anxiety: αναγνώρισε ότι το άγχος είναι αληθινό, μην το ακυρώσεις.
- Αν είναι real_concern: ενθάρρυνε ιατρική επίσκεψη.
- ΧΩΡΙΣ markdown, ΜΟΝΟ JSON.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Απαντάς πάντα με valid JSON, χωρίς markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      if (aiResp.status === 429) return json({ error: "Rate limit" }, 429);
      if (aiResp.status === 402) return json({ error: "Credits exhausted" }, 402);
      return json({ error: "AI failure" }, 500);
    }

    const aiData = await aiResp.json();
    let parsed: any;
    try {
      parsed = JSON.parse(aiData.choices[0].message.content);
    } catch (e) {
      console.error("parse fail", e);
      return json({ error: "Invalid AI response" }, 500);
    }

    // 3. Save insight
    const { data: saved, error: saveErr } = await supabase
      .from("symptom_pattern_insights")
      .insert({
        user_id: user.id,
        pattern_type: parsed.pattern_type ?? "normal",
        confidence: parsed.confidence ?? 0.5,
        search_count_7d: signals.search_count_7d,
        search_count_30d: signals.search_count_30d,
        unique_symptoms_7d: signals.unique_symptoms_7d,
        recurring_symptoms: signals.recurring_symptoms,
        ai_summary: parsed.ai_summary,
        ai_recommendation: parsed.ai_recommendation,
        empathetic_message: parsed.empathetic_message,
        signals,
        ai_model: "google/gemini-2.5-flash",
      })
      .select()
      .single();

    if (saveErr) console.error("save error", saveErr);

    return json({ ...parsed, signals, saved });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
