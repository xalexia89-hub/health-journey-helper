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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { new_medication, current_medications } = await req.json();
    if (!new_medication || typeof new_medication !== "string") {
      return new Response(JSON.stringify({ error: "new_medication required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const currentList = Array.isArray(current_medications) ? current_medications : [];

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
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a clinical pharmacology assistant. Check if a NEW medication has known interactions with the patient's CURRENT medications.

Severity rules:
- mild: monitor, generally safe
- moderate: consult doctor before continuing
- severe: avoid combination
- none: no known interactions

Be specific about the interaction mechanism. NEVER tell the patient to stop a medication — always say "discuss with your doctor".
Respond in Greek. Use the tool call.`,
            },
            {
              role: "user",
              content: `Νέο φάρμακο: ${new_medication}\nΤρέχοντα φάρμακα: ${currentList.length ? currentList.join(", ") : "κανένα"}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_interactions",
                description: "Report drug interaction findings",
                parameters: {
                  type: "object",
                  properties: {
                    severity: {
                      type: "string",
                      enum: ["none", "mild", "moderate", "severe"],
                    },
                    summary: { type: "string", description: "Greek summary for patient" },
                    interactions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          with: { type: "string" },
                          mechanism: { type: "string" },
                          recommendation: { type: "string" },
                        },
                        required: ["with", "mechanism", "recommendation"],
                      },
                    },
                  },
                  required: ["severity", "summary", "interactions"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "report_interactions" } },
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
      throw new Error(`AI error ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);
    const severity = parsed.severity || "none";
    const summary = parsed.summary || "";
    const interactions = parsed.interactions || [];

    // Log
    await supabase.from("drug_interaction_logs").insert({
      patient_id: userData.user.id,
      new_medication,
      current_medications: currentList,
      interactions_found: interactions,
      severity,
    });

    return new Response(
      JSON.stringify({ severity, summary, interactions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("check-drug-interactions error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
