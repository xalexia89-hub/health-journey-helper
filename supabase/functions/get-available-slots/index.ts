import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Slot {
  start: string; // ISO
  end: string;
  label: string; // HH:MM
  available: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { provider_id, date } = await req.json();
    if (!provider_id || !date) {
      return new Response(JSON.stringify({ error: "provider_id and date required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Parse target date in local terms
    const targetDate = new Date(date + "T00:00:00");
    const dayOfWeek = targetDate.getDay(); // 0=Sun..6=Sat

    // 1. Check if blocked
    const { data: blocked } = await supabase
      .from("provider_blocked_dates")
      .select("id")
      .eq("provider_id", provider_id)
      .eq("blocked_date", date)
      .maybeSingle();

    if (blocked) {
      return new Response(JSON.stringify({ slots: [], blocked: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Get availability windows for that day
    const { data: windows } = await supabase
      .from("availability_slots")
      .select("start_time, end_time, slot_duration_minutes")
      .eq("provider_id", provider_id)
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true);

    if (!windows || windows.length === 0) {
      return new Response(JSON.stringify({ slots: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Generate all candidate slots
    const allSlots: Slot[] = [];
    for (const w of windows) {
      const duration = w.slot_duration_minutes ?? 30;
      const [sH, sM] = w.start_time.split(":").map(Number);
      const [eH, eM] = w.end_time.split(":").map(Number);
      let cur = new Date(targetDate);
      cur.setHours(sH, sM, 0, 0);
      const end = new Date(targetDate);
      end.setHours(eH, eM, 0, 0);

      while (cur.getTime() + duration * 60000 <= end.getTime()) {
        const slotEnd = new Date(cur.getTime() + duration * 60000);
        const hh = String(cur.getHours()).padStart(2, "0");
        const mm = String(cur.getMinutes()).padStart(2, "0");
        allSlots.push({
          start: cur.toISOString(),
          end: slotEnd.toISOString(),
          label: `${hh}:${mm}`,
          available: true,
        });
        cur = slotEnd;
      }
    }

    // 4. Get booked appointments for that day
    const { data: appts } = await supabase
      .from("appointments")
      .select("appointment_time, slot_start, status")
      .eq("provider_id", provider_id)
      .eq("appointment_date", date)
      .in("status", ["pending", "confirmed"]);

    const bookedTimes = new Set<string>();
    (appts ?? []).forEach((a: any) => {
      if (a.slot_start) {
        bookedTimes.add(new Date(a.slot_start).toISOString());
      } else if (a.appointment_time) {
        const [h, m] = a.appointment_time.split(":").map(Number);
        const d = new Date(targetDate);
        d.setHours(h, m, 0, 0);
        bookedTimes.add(d.toISOString());
      }
    });

    // 5. Get active locks
    const { data: locks } = await supabase
      .from("appointment_slot_locks")
      .select("slot_start, locked_until")
      .eq("provider_id", provider_id)
      .gt("locked_until", new Date().toISOString());

    const lockedTimes = new Set<string>(
      (locks ?? []).map((l: any) => new Date(l.slot_start).toISOString()),
    );

    // 6. Mark unavailable + filter past
    const now = Date.now();
    const filtered = allSlots
      .map((s) => {
        const iso = new Date(s.start).toISOString();
        const isPast = new Date(s.start).getTime() <= now;
        return {
          ...s,
          available: !bookedTimes.has(iso) && !lockedTimes.has(iso) && !isPast,
          past: isPast,
        };
      })
      .filter((s) => !s.past);

    return new Response(JSON.stringify({ slots: filtered }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("get-available-slots error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
