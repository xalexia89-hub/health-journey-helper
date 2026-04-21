import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOCK_MINUTES = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { provider_id, slot_start, slot_end } = await req.json();
    if (!provider_id || !slot_start || !slot_end) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cleanup expired locks first
    await supabase.rpc("cleanup_expired_slot_locks");

    // Check for booked appointment at that slot
    const slotIso = new Date(slot_start).toISOString();
    const dateStr = slotIso.slice(0, 10);
    const { data: existing } = await supabase
      .from("appointments")
      .select("id")
      .eq("provider_id", provider_id)
      .eq("appointment_date", dateStr)
      .in("status", ["pending", "confirmed"])
      .or(`slot_start.eq.${slotIso}`);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ error: "slot_taken" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString();

    // Try insert; if conflict (someone else locked), check ownership
    const { data: lock, error: insErr } = await supabase
      .from("appointment_slot_locks")
      .insert({
        provider_id,
        slot_start: slotIso,
        slot_end: new Date(slot_end).toISOString(),
        locked_by: userId,
        locked_until: lockedUntil,
      })
      .select()
      .single();

    if (insErr) {
      // Check existing
      const { data: cur } = await supabase
        .from("appointment_slot_locks")
        .select("*")
        .eq("provider_id", provider_id)
        .eq("slot_start", slotIso)
        .maybeSingle();

      if (cur && cur.locked_by === userId && new Date(cur.locked_until).getTime() > Date.now()) {
        // Refresh own lock
        const { data: refreshed } = await supabase
          .from("appointment_slot_locks")
          .update({ locked_until: lockedUntil })
          .eq("id", cur.id)
          .select()
          .single();
        return new Response(
          JSON.stringify({ lock_id: refreshed!.id, locked_until: refreshed!.locked_until }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (cur && new Date(cur.locked_until).getTime() <= Date.now()) {
        // Expired — take over
        await supabase.from("appointment_slot_locks").delete().eq("id", cur.id);
        const { data: newLock, error: e2 } = await supabase
          .from("appointment_slot_locks")
          .insert({
            provider_id,
            slot_start: slotIso,
            slot_end: new Date(slot_end).toISOString(),
            locked_by: userId,
            locked_until: lockedUntil,
          })
          .select()
          .single();
        if (e2) throw e2;
        return new Response(
          JSON.stringify({ lock_id: newLock!.id, locked_until: newLock!.locked_until }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(JSON.stringify({ error: "slot_locked_by_other" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ lock_id: lock!.id, locked_until: lock!.locked_until }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("lock-slot error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
