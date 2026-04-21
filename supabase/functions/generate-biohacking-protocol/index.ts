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

    const { assessment_id, duration_weeks = 8 } = await req.json();
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

    const systemPrompt = `Είσαι ειδικός βελτιστοποίησης απόδοσης βασισμένος σε επιστημονικά δεδομένα (sleep science, stress physiology, energy systems).
Δημιούργησε δομημένο πρωτόκολλο ${duration_weeks} εβδομάδων για το άτομο.

ΔΟΜΗ ΠΡΩΤΟΚΟΛΛΟΥ — 3 Tiers:
- Tier 1 (Lifestyle): Πάντα ασφαλές. Sleep hygiene, light exposure, breathing, exercise timing, hydration, digital detox.
- Tier 2 (Supplements/Tools): Καλή τεκμηρίωση, ελάχιστο ρίσκο. ΠΑΝΤΑ σημείωση "Συμβουλευτείτε γιατρό αν λαμβάνετε φάρμακα". Magnesium glycinate, ashwagandha, L-theanine+caffeine, cold exposure, red light.
- Tier 3 (Medical): Απαιτεί ιατρική παρακολούθηση. Lab tests, hormone optimization, prescription aids. ΣΗΜΑΝΣΗ "Απαιτεί ιατρική παρακολούθηση".

ΣΤΑΔΙΑΚΗ ΕΞΕΛΙΞΗ:
- Εβδ. 1-2: Foundation (μόνο Tier 1)
- Εβδ. 3-5: Build (πρόσθεσε Tier 2)
- Εβδ. 6-${duration_weeks}: Optimize (fine-tune + προαιρετικό Tier 3 referral)

Για κάθε intervention:
- Τίτλος + περιγραφή στα Ελληνικά
- evidence_level: strong/moderate/emerging
- frequency, duration_minutes
- mechanism (1 πρόταση γιατί λειτουργεί)
- contraindications (αν υπάρχουν)

Εστίαση στα priority domains του χρήστη.
Στο τέλος, disclaimer: δεν είναι ιατρική συμβουλή, Tier 3 απαιτεί γιατρό.

Χρησιμοποίησε ΥΠΟΧΡΕΩΤΙΚΑ το tool generate_protocol.`;

    const userContext = {
      scores: {
        sleep: assessment.sleep_score, energy: assessment.energy_score,
        stress: assessment.stress_score, overall: assessment.overall_performance_score,
      },
      persona: assessment.persona_tag,
      priority_domains: assessment.priority_domains,
      key_findings: assessment.key_findings,
      raw: {
        sleep_hours: assessment.sleep_hours_avg, sleep_quality: assessment.sleep_quality,
        energy_morning: assessment.energy_morning, energy_afternoon: assessment.energy_afternoon,
        stress_level: assessment.stress_level, caffeine_cups: assessment.caffeine_cups_per_day,
        meditation_min: assessment.meditation_minutes_per_day,
        exercise: assessment.exercise_type, exercise_days: assessment.exercise_days_per_week,
        primary_goal: assessment.primary_goal,
      },
    };

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Δημιούργησε πρωτόκολλο για:\n${JSON.stringify(userContext, null, 2)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_protocol",
            description: "Επιστρέφει δομημένο πρωτόκολλο βελτιστοποίησης",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Τίτλος πρωτοκόλλου στα Ελληνικά" },
                summary: { type: "string", description: "2-3 πρότασεις περιγραφή" },
                ai_reasoning: { type: "string", description: "Γιατί επιλέχθηκε αυτή η στρατηγική (3-4 προτάσεις)" },
                domains: { type: "array", items: { type: "string", enum: ["sleep","energy","stress"] } },
                interventions: {
                  type: "array",
                  minItems: 8,
                  maxItems: 18,
                  items: {
                    type: "object",
                    properties: {
                      domain: { type: "string", enum: ["sleep","energy","stress","nutrition","movement","mindfulness","supplements"] },
                      tier: { type: "integer", minimum: 1, maximum: 3 },
                      title: { type: "string" },
                      description: { type: "string" },
                      mechanism: { type: "string" },
                      evidence_level: { type: "string", enum: ["strong","moderate","emerging","anecdotal"] },
                      frequency: { type: "string" },
                      duration_minutes: { type: "integer" },
                      week_start: { type: "integer", minimum: 1 },
                      week_end: { type: "integer" },
                      is_mandatory: { type: "boolean" },
                      contraindications: { type: "array", items: { type: "string" } },
                    },
                    required: ["domain","tier","title","description","mechanism","evidence_level","frequency","week_start","week_end","is_mandatory"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title","summary","ai_reasoning","domains","interventions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_protocol" } },
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
    const proto = JSON.parse(toolCall.function.arguments);

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration_weeks * 7);

    const hasTier3 = proto.interventions.some((i: any) => i.tier === 3);
    const hasTier2 = proto.interventions.some((i: any) => i.tier === 2);
    const tierLabel = hasTier3 ? "medical" : hasTier2 ? "supplements" : "lifestyle";

    const { data: protocol, error: perr } = await supabase
      .from("biohacking_protocols")
      .insert({
        patient_id: user.id,
        assessment_id,
        title: proto.title,
        duration_weeks,
        domains: proto.domains,
        tier: tierLabel,
        status: "active",
        start_date: startDate.toISOString().slice(0, 10),
        end_date: endDate.toISOString().slice(0, 10),
        protocol_data: { summary: proto.summary, generated_at: new Date().toISOString() },
        ai_reasoning: proto.ai_reasoning,
      })
      .select()
      .single();

    if (perr) throw perr;

    const interventionRows = proto.interventions.map((i: any) => ({
      protocol_id: protocol.id,
      domain: i.domain,
      tier: i.tier,
      title: i.title,
      description: i.description,
      mechanism: i.mechanism,
      evidence_level: i.evidence_level,
      frequency: i.frequency,
      duration_minutes: i.duration_minutes ?? null,
      week_start: i.week_start,
      week_end: i.week_end,
      is_mandatory: i.is_mandatory,
      contraindications: i.contraindications ?? [],
    }));

    const { error: ierr } = await supabase
      .from("protocol_interventions")
      .insert(interventionRows);

    if (ierr) throw ierr;

    return new Response(JSON.stringify({ success: true, protocol_id: protocol.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-biohacking-protocol error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
