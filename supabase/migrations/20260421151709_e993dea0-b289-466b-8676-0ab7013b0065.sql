-- 1. New table: appointment_slot_locks
CREATE TABLE IF NOT EXISTS public.appointment_slot_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  locked_by UUID NOT NULL,
  locked_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, slot_start)
);

ALTER TABLE public.appointment_slot_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view active locks"
ON public.appointment_slot_locks FOR SELECT
TO authenticated
USING (locked_until > now());

CREATE POLICY "Users can create own locks"
ON public.appointment_slot_locks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = locked_by);

CREATE POLICY "Users can delete own locks"
ON public.appointment_slot_locks FOR DELETE
TO authenticated
USING (auth.uid() = locked_by);

CREATE POLICY "Admins manage all locks"
ON public.appointment_slot_locks FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_slot_locks_provider_until ON public.appointment_slot_locks(provider_id, locked_until);

-- 2. New table: provider_blocked_dates
CREATE TABLE IF NOT EXISTS public.provider_blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, blocked_date)
);

ALTER TABLE public.provider_blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view blocked dates"
ON public.provider_blocked_dates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Providers manage own blocked dates"
ON public.provider_blocked_dates FOR ALL
USING (EXISTS (
  SELECT 1 FROM providers
  WHERE providers.id = provider_blocked_dates.provider_id
    AND providers.user_id = auth.uid()
));

CREATE POLICY "Admins manage all blocked dates"
ON public.provider_blocked_dates FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Extend appointments table
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS slot_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS slot_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_type TEXT CHECK (meeting_type IN ('in_person','video')) DEFAULT 'in_person',
  ADD COLUMN IF NOT EXISTS video_link TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_by TEXT CHECK (cancelled_by IN ('patient','provider','system')),
  ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reason_for_visit TEXT;

CREATE INDEX IF NOT EXISTS idx_appointments_slot_start ON public.appointments(slot_start);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_date ON public.appointments(provider_id, appointment_date);

-- 4. Enable Realtime on appointments and slot_locks
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.appointment_slot_locks REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'appointments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'appointment_slot_locks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.appointment_slot_locks;
  END IF;
END $$;

-- 5. Cleanup function for expired locks (called by cron + on-demand)
CREATE OR REPLACE FUNCTION public.cleanup_expired_slot_locks()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.appointment_slot_locks WHERE locked_until < now();
$$;

-- 6. Patient cancel with policy (24h rule, full implementation in edge function but RPC for direct calls)
CREATE OR REPLACE FUNCTION public.cancel_appointment_v2(
  p_appointment_id UUID,
  p_cancelled_by TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_appt RECORD;
  v_is_provider BOOLEAN;
  v_hours_until NUMERIC;
BEGIN
  SELECT a.*, p.user_id AS provider_user_id
  INTO v_appt
  FROM appointments a
  JOIN providers p ON p.id = a.provider_id
  WHERE a.id = p_appointment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  v_is_provider := (v_appt.provider_user_id = auth.uid());

  IF NOT (v_appt.patient_id = auth.uid() OR v_is_provider OR has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF v_appt.status NOT IN ('pending', 'confirmed') THEN
    RAISE EXCEPTION 'Appointment cannot be cancelled in status %', v_appt.status;
  END IF;

  v_hours_until := EXTRACT(EPOCH FROM (
    COALESCE(v_appt.slot_start, (v_appt.appointment_date + v_appt.appointment_time)::timestamptz) - now()
  )) / 3600;

  UPDATE appointments
  SET status = 'cancelled',
      cancelled_by = p_cancelled_by,
      cancellation_reason = p_reason,
      updated_at = now()
  WHERE id = p_appointment_id;

  RETURN jsonb_build_object(
    'success', true,
    'hours_until_appointment', v_hours_until,
    'cancelled_by', p_cancelled_by
  );
END;
$$;