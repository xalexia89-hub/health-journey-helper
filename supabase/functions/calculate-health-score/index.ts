import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const targetId = body.patient_id || userData.user.id;

    // Fetch holistic context
    const ctxResp = await fetch(
      `${supabaseUrl}/functions/v1/assemble-patient-context`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          apikey: supabaseAnonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient_id: targetId }),
      },
    );
    const { context } = await ctxResp.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are the Medithos Holistic Health Score engine. Calculate a single integer 0-100 score based on the patient's full context.

Weights:
- Lab results (out-of-range values reduce): 25%
- Medication adherence signals (active reminders, simplicity): 15%
- Hereditary risk flags (high risk reduces): 20%
- Lifestyle (smoking, exercise, sleep, stress): 20%
- Prevention plan adherence: 10%
- Recent critical alerts: 10%

Return ONLY via the tool call. No prose. Score must be an integer 0-100.
Factors must be 3 short bullet points (Greek) explaining the main drivers.
Top recommendations must be 3 actionable suggestions (Greek) that would improve the score.`,
            },
            {
              role: "user",
              content: `Patient context:\n${JSON.stringify(context, null, 2)}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_health_score",
                description: "Return holistic health score with factors and recommendations",
                parameters: {
                  type: "object",
                  properties: {
                    score: { type: "integer", minimum: 0, maximum: 100 },
                    factors: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 3,
                    },
                    top_recommendations: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 3,
                    },
                  },
                  required: ["score", "factors", "top_recommendations"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_health_score" } },
        }),
      },
    );

    if (!aiResp.ok) {
      if (aiResp.status === 429 || aiResp.status === 402) {
        return new Response(
          JSON.stringify({
            error: aiResp.status === 429 ? "rate_limit" : "payment_required",
          }),
          { status: aiResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await aiResp.text();
      console.error("AI error:", aiResp.status, t);
      throw new Error(`AI error ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);
    const score = Math.max(0, Math.min(100, parseInt(parsed.score, 10)));
    const factors = parsed.factors || [];
    const recommendations = parsed.top_recommendations || [];

    // Persist
    await supabase.from("health_scores").insert({
      patient_id: targetId,
      score,
      factors,
      top_recommendations: recommendations,
    });

    return new Response(
      JSON.stringify({ score, factors, top_recommendations: recommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("calculate-health-score error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
