// Medication safety check via Lovable AI (Gemini)
// Returns side effects, interactions, allergy warnings, severity
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Body {
  patient_user_id: string;
  medication_name: string;
  dosage?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = (await req.json()) as Body;
    if (!body?.medication_name || !body?.patient_user_id) {
      return json({ error: "Missing fields" }, 400);
    }

    // Fetch patient's existing record (allergies + current meds)
    const { data: record } = await supabase
      .from("medical_records")
      .select("allergies, current_medications, chronic_conditions")
      .eq("user_id", body.patient_user_id)
      .maybeSingle();

    // Fetch active prescriptions
    const { data: existingRx } = await supabase
      .from("medication_prescriptions")
      .select("medication_name, dosage")
      .eq("patient_user_id", body.patient_user_id)
      .eq("status", "active");

    const allergies = record?.allergies ?? [];
    const currentMeds = [
      ...(record?.current_medications ?? []),
      ...(existingRx?.map((r: any) => `${r.medication_name}${r.dosage ? ` (${r.dosage})` : ""}`) ?? []),
    ];
    const conditions = record?.chronic_conditions ?? [];

    const prompt = `Είσαι κλινικός φαρμακοποιός. Αξιολόγησε το παρακάτω φάρμακο για τον ασθενή και απάντα ΜΟΝΟ με valid JSON στα Ελληνικά.

ΦΑΡΜΑΚΟ: ${body.medication_name}${body.dosage ? ` - ${body.dosage}` : ""}

ΑΛΛΕΡΓΙΕΣ ΑΣΘΕΝΗ: ${allergies.length ? allergies.join(", ") : "καμία καταγεγραμμένη"}
ΤΡΕΧΟΝΤΑ ΦΑΡΜΑΚΑ: ${currentMeds.length ? currentMeds.join(", ") : "κανένα"}
ΧΡΟΝΙΕΣ ΠΑΘΗΣΕΙΣ: ${conditions.length ? conditions.join(", ") : "καμία"}

Επέστρεψε JSON με αυτό ακριβώς το schema:
{
  "side_effects": ["παρενέργεια 1", "παρενέργεια 2"],
  "contraindications": ["αντένδειξη 1"],
  "drug_interactions": [{"with": "όνομα φαρμάκου", "severity": "low|moderate|high", "description": "περιγραφή"}],
  "allergy_warnings": [{"allergen": "ουσία", "risk": "low|moderate|high", "description": "περιγραφή"}],
  "severity": "safe|caution|warning|danger",
  "ai_summary": "σύντομη περίληψη 1-2 προτάσεων με την κλινική κρίση"
}

Κανόνες:
- severity = "danger" αν υπάρχει σοβαρή αλλεργία ή high-severity interaction
- severity = "warning" για moderate interactions ή σχετικές αντενδείξεις
- severity = "caution" για ήπιες ανησυχίες
- severity = "safe" αν δεν υπάρχουν θέματα
- Χωρίς εξωτερικό κείμενο, ΜΟΝΟ JSON.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Απαντάς πάντα με valid JSON, χωρίς markdown code fences." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      if (aiResp.status === 429) return json({ error: "Rate limit. Δοκιμάστε ξανά σε λίγο." }, 429);
      if (aiResp.status === 402) return json({ error: "Εξαντλήθηκαν AI credits." }, 402);
      return json({ error: "AI failure" }, 500);
    }

    const aiData = await aiResp.json();
    let parsed: any;
    try {
      parsed = JSON.parse(aiData.choices[0].message.content);
    } catch (e) {
      console.error("JSON parse failed", e);
      return json({ error: "Invalid AI response" }, 500);
    }

    return json({
      ...parsed,
      ai_model: "google/gemini-2.5-flash",
      checked_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Function error", e);
    return json({ error: String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
