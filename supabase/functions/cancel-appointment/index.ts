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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { appointment_id, cancelled_by, reason } = await req.json();
    if (!appointment_id || !cancelled_by) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use the RPC (runs as caller via SECURITY DEFINER but checks auth.uid())
    const { data, error } = await userClient.rpc("cancel_appointment_v2", {
      p_appointment_id: appointment_id,
      p_cancelled_by: cancelled_by,
      p_reason: reason ?? null,
    });

    if (error) throw error;

    // Fetch appointment + provider + patient for email
    const { data: appt } = await admin
      .from("appointments")
      .select(`
        id, appointment_date, appointment_time, slot_start, meeting_type,
        patient_id, provider_id, cancelled_by, cancellation_reason,
        provider:providers (name, user_id)
      `)
      .eq("id", appointment_id)
      .single();

    if (appt) {
      const { data: patientProfile } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", appt.patient_id)
        .maybeSingle();

      // Notify patient
      if (patientProfile?.email) {
        await admin.functions.invoke("send-transactional-email", {
          body: {
            templateName: "appointment-cancelled",
            recipientEmail: patientProfile.email,
            idempotencyKey: `appt-cancel-${appointment_id}-patient`,
            templateData: {
              recipientName: patientProfile.full_name ?? "",
              providerName: (appt as any).provider?.name ?? "",
              appointmentDate: appt.appointment_date,
              appointmentTime: (appt.appointment_time ?? "").slice(0, 5),
              cancelledBy: appt.cancelled_by,
              reason: appt.cancellation_reason ?? "",
            },
          },
        });
      }

      // Notify provider (if has user)
      const providerUserId = (appt as any).provider?.user_id;
      if (providerUserId) {
        const { data: provProfile } = await admin
          .from("profiles")
          .select("email, full_name")
          .eq("id", providerUserId)
          .maybeSingle();
        if (provProfile?.email) {
          await admin.functions.invoke("send-transactional-email", {
            body: {
              templateName: "appointment-cancelled",
              recipientEmail: provProfile.email,
              idempotencyKey: `appt-cancel-${appointment_id}-provider`,
              templateData: {
                recipientName: provProfile.full_name ?? "",
                providerName: (appt as any).provider?.name ?? "",
                appointmentDate: appt.appointment_date,
                appointmentTime: (appt.appointment_time ?? "").slice(0, 5),
                cancelledBy: appt.cancelled_by,
                reason: appt.cancellation_reason ?? "",
              },
            },
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cancel-appointment error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
