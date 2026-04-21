import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CACHE_MINUTES = 15;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { patient_id, force_refresh } = await req.json();
    const targetId = patient_id || userData.user.id;

    // Cache check
    if (!force_refresh) {
      const { data: cached } = await supabase
        .from("context_cache")
        .select("context_data, cached_at")
        .eq("patient_id", targetId)
        .maybeSingle();

      if (cached?.cached_at) {
        const ageMin =
          (Date.now() - new Date(cached.cached_at).getTime()) / 60000;
        if (ageMin < CACHE_MINUTES) {
          return new Response(
            JSON.stringify({ context: cached.context_data, cached: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
    }

    // Parallel fetch — RLS will block unauthorized rows automatically
    const [
      profileRes,
      healthFileRes,
      lifestyleRes,
      medicalRecordRes,
      medicationsRes,
      labsRes,
      documentsRes,
      familyRes,
      appointmentsRes,
      symptomSessionsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", targetId).maybeSingle(),
      supabase.from("health_files").select("*").eq("user_id", targetId).maybeSingle(),
      supabase.from("patient_health_profiles").select("*").eq("user_id", targetId).maybeSingle(),
      supabase.from("medical_records").select("*").eq("user_id", targetId).maybeSingle(),
      supabase.from("medications").select("name, dosage, frequency, start_date, is_active").eq("user_id", targetId).eq("is_active", true).limit(50),
      supabase.from("medical_entries").select("title, description, entry_date, entry_type, metadata").eq("user_id", targetId).in("entry_type", ["blood_test", "imaging", "diagnosis"]).order("entry_date", { ascending: false }).limit(20),
      supabase.from("medical_documents").select("file_name, document_category, uploaded_at").eq("user_id", targetId).order("uploaded_at", { ascending: false }).limit(20),
      supabase.from("family_history").select("*").eq("user_id", targetId),
      supabase.from("appointments").select("appointment_date, status, visit_type, providers(name, specialty)").eq("patient_id", targetId).order("appointment_date", { ascending: false }).limit(20),
      supabase.from("symptom_intakes").select("primary_symptoms, urgency_level, created_at").eq("user_id", targetId).order("created_at", { ascending: false }).limit(20),
    ]);

    const hf = healthFileRes.data || {};
    const ls = lifestyleRes.data || {};
    const mr = medicalRecordRes.data || {};

    let age: number | null = null;
    if (hf.date_of_birth) {
      const dob = new Date(hf.date_of_birth);
      age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000));
    }

    // Hereditary risk flags (simple heuristic)
    const family = familyRes.data || [];
    const conditionCounts: Record<string, number> = {};
    for (const m of family) {
      const conds: string[] = m.conditions || [];
      for (const c of conds) {
        conditionCounts[c] = (conditionCounts[c] || 0) + 1;
      }
    }
    const hereditary_risk_flags = Object.entries(conditionCounts).map(([condition, count]) => ({
      condition,
      risk_level: count >= 2 ? "high" : "medium",
      reasoning: `${count} family member(s) affected`,
    }));

    // Symptom themes
    const allSymptoms: string[] = [];
    for (const s of symptomSessionsRes.data || []) {
      if (Array.isArray(s.primary_symptoms)) allSymptoms.push(...s.primary_symptoms);
    }
    const symptomCounts: Record<string, number> = {};
    for (const s of allSymptoms) symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    const symptom_search_patterns = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([s]) => s);

    // Specialty frequency
    const specialtyCounts: Record<string, number> = {};
    for (const a of appointmentsRes.data || []) {
      const spec = (a as any).providers?.specialty;
      if (spec) specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1;
    }
    const most_visited_specialties = Object.entries(specialtyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([s]) => s);

    const context = {
      patient_id: targetId,
      age,
      gender: hf.sex || null,
      blood_type: mr.blood_type || null,

      chronic_conditions: mr.chronic_conditions || [],
      past_diagnoses: (labsRes.data || []).filter((e) => e.entry_type === "diagnosis").map((e) => e.title),
      past_surgeries: mr.past_surgeries || [],
      current_medications: (medicationsRes.data || []).map((m) => ({
        name: m.name,
        dose: m.dosage,
        frequency: m.frequency,
        since: m.start_date,
      })),
      allergies: mr.allergies || [],
      last_lab_results: (labsRes.data || [])
        .filter((e) => e.entry_type === "blood_test")
        .slice(0, 10)
        .map((e) => ({
          test: e.title,
          value: (e.metadata as any)?.value || "",
          unit: (e.metadata as any)?.unit || "",
          date: e.entry_date,
          flag: (e.metadata as any)?.flag || "normal",
        })),
      uploaded_files_summary: (documentsRes.data || []).map((d) => d.file_name),

      family_history: family.map((m) => ({
        relation: m.relation,
        conditions: m.conditions || [],
        age_of_onset: m.age_of_onset,
        deceased: m.deceased,
        cause_of_death: m.cause_of_death,
      })),
      hereditary_risk_flags,

      appointment_history: (appointmentsRes.data || []).map((a) => ({
        specialty: (a as any).providers?.specialty || "unknown",
        date: a.appointment_date,
        reason: a.visit_type || "consultation",
        status: a.status,
      })),
      most_visited_specialties,
      ai_navigator_topics: symptom_search_patterns,
      symptom_search_patterns,
      prevention_plan_adherence: "unknown",
      last_platform_activity: new Date().toISOString(),

      lifestyle: {
        smoking: ls.smoking ?? hf.smoking_status ?? null,
        alcohol: ls.alcohol ?? hf.alcohol_consumption ?? null,
        exercise_frequency: ls.exercise_frequency ?? hf.activity_level ?? null,
        diet_notes: ls.diet_notes ?? null,
        stress_level: ls.stress_level ?? null,
        sleep_hours: ls.sleep_hours ?? null,
        work_type: ls.work_type ?? null,
        wearable_device: ls.wearable_device ?? null,
      },

      profile: {
        full_name: profileRes.data?.full_name || null,
      },
    };

    // Upsert cache
    await supabase.from("context_cache").upsert({
      patient_id: targetId,
      context_data: context,
      cached_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ context, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("assemble-patient-context error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
