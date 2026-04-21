import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find confirmed appointments in 23-25h window without reminder
    const now = new Date();
    const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString();
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

    const { data: appts, error } = await admin
      .from("appointments")
      .select(`
        id, appointment_date, appointment_time, slot_start, meeting_type,
        patient_id, reminder_sent,
        provider:providers (name, address, city)
      `)
      .eq("status", "confirmed")
      .eq("reminder_sent", false)
      .gte("appointment_date", now.toISOString().slice(0, 10));

    if (error) throw error;

    let sent = 0;
    for (const a of appts ?? []) {
      // Compute slot start
      const slotStart = a.slot_start
        ? new Date(a.slot_start)
        : new Date(`${a.appointment_date}T${a.appointment_time}`);
      if (slotStart.toISOString() < in23h || slotStart.toISOString() > in25h) continue;

      const { data: patient } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", a.patient_id)
        .maybeSingle();
      if (!patient?.email) continue;

      await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "appointment-reminder",
          recipientEmail: patient.email,
          idempotencyKey: `appt-reminder-${a.id}`,
          templateData: {
            recipientName: patient.full_name ?? "",
            providerName: (a as any).provider?.name ?? "",
            appointmentDate: a.appointment_date,
            appointmentTime: (a.appointment_time ?? "").slice(0, 5),
            meetingType: a.meeting_type,
            address: (a as any).provider?.address ?? "",
            city: (a as any).provider?.city ?? "",
          },
        },
      });

      await admin.from("appointments").update({ reminder_sent: true }).eq("id", a.id);
      sent++;
    }

    return new Response(JSON.stringify({ success: true, sent, scanned: appts?.length ?? 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-appointment-reminders error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
