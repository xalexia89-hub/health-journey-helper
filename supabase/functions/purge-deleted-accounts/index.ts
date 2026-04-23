// GDPR Article 17 — Right to erasure.
// Run daily via pg_cron. Hard-deletes accounts whose 30-day grace period has expired.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find accounts past their scheduled deletion date
  const { data: pending, error } = await supabase
    .from("data_deletion_requests")
    .select("id, user_id")
    .eq("status", "pending")
    .lte("scheduled_deletion_at", new Date().toISOString());

  if (error) {
    return json({ error: error.message }, 500);
  }

  const results: Array<{ user_id: string; ok: boolean; err?: string }> = [];

  for (const req of pending ?? []) {
    try {
      // Delete the auth user — cascades to all FK-referenced tables
      const { error: delErr } = await supabase.auth.admin.deleteUser(req.user_id);
      if (delErr) throw delErr;

      await supabase
        .from("data_deletion_requests")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", req.id);

      results.push({ user_id: req.user_id, ok: true });
    } catch (e) {
      results.push({ user_id: req.user_id, ok: false, err: (e as Error).message });
    }
  }

  return json({ processed: results.length, results }, 200);
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
