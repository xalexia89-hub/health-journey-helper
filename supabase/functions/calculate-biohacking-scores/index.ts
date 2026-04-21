import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { assessment_id } = await req.json();
    if (!assessment_id) {
      return new Response(JSON.stringify({ error: "assessment_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: assessment, error: aerr } = await supabase
      .from("biohacking_assessments")
      .select("*")
      .eq("id", assessment_id)
      .eq("patient_id", user.id)
      .maybeSingle();

    if (aerr || !assessment) {
      return new Response(JSON.stringify({ error: "Assessment not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `Είσαι ειδικός βελτιστοποίησης απόδοσης (performance optimization specialist).
Ανάλυσε δεδομένα Sleep, Energy, Stress ενός ατόμου και υπολόγισε scores 0-100:
- Sleep Score: ώρες, ποιότητα, σταθερότητα, latency, αφυπνίσεις.
- Energy Score: επίπεδα ημέρας, crash, καφεΐνη, ενυδάτωση.
- Stress Score: ΑΝΤΙΣΤΡΟΦΗ κλίμακα — υψηλό stress = χαμηλό score. Recovery, ώρες εργασίας.
Overall = Sleep*0.35 + Energy*0.35 + Stress*0.30.

Persona tags (διάλεξε ΕΝΑ):
- sleep_deprived_achiever: υψηλό stress + κακός ύπνος + αξιοπρεπής ενέργεια
- burnout_risk: υψηλό stress + χαμηλή ενέργεια + κακός ύπνος
- high_performer: καλά scores παντού
- energy_depleted: χαμηλή ενέργεια κύριο θέμα
- stress_overloaded: stress κύριο θέμα
- good_baseline: αξιοπρεπή scores, περιθώριο βελτιστοποίησης

Χρησιμοποίησε ΥΠΟΧΡΕΩΤΙΚΑ το tool calculate_scores. Όλα τα κείμενα στα Ελληνικά.`;

    const userPayload = {
      sleep: {
        hours: assessment.sleep_hours_avg, quality: assessment.sleep_quality,
        latency_min: assessment.sleep_latency_minutes, wake_ups: assessment.wake_ups_per_night,
        feel_rested: assessment.feel_rested, consistent: assessment.sleep_schedule_consistent,
        environment: assessment.sleep_environment, screens_before_bed: assessment.screens_before_bed,
      },
      energy: {
        morning: assessment.energy_morning, afternoon: assessment.energy_afternoon,
        evening: assessment.energy_evening, crash: assessment.afternoon_crash,
        caffeine_cups: assessment.caffeine_cups_per_day, caffeine_cutoff_hour: assessment.caffeine_cutoff_hour,
        water_l: assessment.hydration_liters,
      },
      stress: {
        level: assessment.stress_level, sources: assessment.stress_sources,
        recovery: assessment.recovery_activities, meditation_min: assessment.meditation_minutes_per_day,
        work_hours: assessment.work_hours_per_day, screen_time_h: assessment.screen_time_hours,
        nature_h_weekly: assessment.nature_time_weekly_hours,
      },
      context: {
        exercise_type: assessment.exercise_type, exercise_days: assessment.exercise_days_per_week,
        diet: assessment.diet_type, smoking: assessment.smoking,
        alcohol_units: assessment.alcohol_units_per_week, hrv_device: assessment.hrv_device,
        hrv_avg: assessment.hrv_avg, primary_goal: assessment.primary_goal,
      },
    };

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Ανάλυσε το παρακάτω assessment:\n${JSON.stringify(userPayload, null, 2)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "calculate_scores",
            description: "Επιστρέφει τα biohacking scores και persona",
            parameters: {
              type: "object",
              properties: {
                sleep_score: { type: "integer", minimum: 0, maximum: 100 },
                energy_score: { type: "integer", minimum: 0, maximum: 100 },
                stress_score: { type: "integer", minimum: 0, maximum: 100 },
                overall_score: { type: "integer", minimum: 0, maximum: 100 },
                persona_tag: {
                  type: "string",
                  enum: ["sleep_deprived_achiever","burnout_risk","high_performer","energy_depleted","stress_overloaded","good_baseline"],
                },
                persona_description: { type: "string", description: "1-2 πρότασεις στα Ελληνικά" },
                key_findings: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
                priority_domains: { type: "array", items: { type: "string", enum: ["sleep","energy","stress"] } },
              },
              required: ["sleep_score","energy_score","stress_score","overall_score","persona_tag","persona_description","key_findings","priority_domains"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "calculate_scores" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Πολλά αιτήματα. Δοκιμάστε ξανά σε λίγο." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits εξαντλήθηκαν." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");
    const result = JSON.parse(toolCall.function.arguments);

    const { error: uerr } = await supabase
      .from("biohacking_assessments")
      .update({
        sleep_score: result.sleep_score,
        energy_score: result.energy_score,
        stress_score: result.stress_score,
        overall_performance_score: result.overall_score,
        persona_tag: result.persona_tag,
        key_findings: { findings: result.key_findings, persona_description: result.persona_description },
        priority_domains: result.priority_domains,
        completed_at: new Date().toISOString(),
      })
      .eq("id", assessment_id)
      .eq("patient_id", user.id);

    if (uerr) throw uerr;

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("calculate-biohacking-scores error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
