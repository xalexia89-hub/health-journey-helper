// GDPR Article 20 — Right to data portability.
// Returns a JSON snapshot of all user-owned data.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const uid = user.id;

    const tables = [
      "profiles",
      "medical_records",
      "health_files",
      "consent_records",
      "appointments",
      "symptom_intakes",
      "symptom_entries",
      "medication_logs",
      "activity_logs",
      "biohacking_assessments",
      "biohacking_protocols",
      "patient_memory",
      "agent_sessions",
      "agent_actions",
    ];

    const result: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      user_id: uid,
      email: user.email,
      gdpr_article: "Article 20 — Data Portability",
    };

    for (const t of tables) {
      try {
        const userColumn = ["appointments"].includes(t) ? "patient_id" :
                          ["profiles"].includes(t) ? "id" :
                          ["patient_memory", "agent_sessions", "agent_actions"].includes(t) ? "patient_id" :
                          "user_id";
        const { data } = await supabase.from(t).select("*").eq(userColumn, uid);
        result[t] = data ?? [];
      } catch {
        result[t] = { error: "table inaccessible" };
      }
    }

    return json(result, 200);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
