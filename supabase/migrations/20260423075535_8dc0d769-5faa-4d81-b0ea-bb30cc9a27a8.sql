
-- 1. Consent records (append-only audit trail)
CREATE TABLE public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'terms_of_service',
    'privacy_policy',
    'health_data_processing',
    'ai_processing',
    'pilot_program',
    'insurance_data_share',
    'physician_data_share',
    'marketing',
    'age_verification'
  )),
  version TEXT NOT NULL DEFAULT '1.0',
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_consent_records_user_type ON public.consent_records(user_id, consent_type, granted_at DESC);

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own consents"
  ON public.consent_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own consents"
  ON public.consent_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all consents"
  ON public.consent_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- No UPDATE / DELETE policies → append-only

-- 2. Data deletion requests (soft delete + 30-day grace)
CREATE TABLE public.data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_deletion_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  completed_at TIMESTAMPTZ,
  ip_address TEXT,
  reason TEXT
);

CREATE INDEX idx_deletion_requests_status_date ON public.data_deletion_requests(status, scheduled_deletion_at);

ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own deletion request"
  ON public.data_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own deletion request"
  ON public.data_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cancel own deletion request"
  ON public.data_deletion_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (status IN ('pending', 'cancelled'));

CREATE POLICY "Admins view all deletion requests"
  ON public.data_deletion_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Soft-delete columns on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scheduled_deletion_at TIMESTAMPTZ;

-- 4. Security incident log (GDPR Art. 33 — 72h notification)
CREATE TABLE public.incident_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reported_to_dpa_at TIMESTAMPTZ,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('data_breach', 'unauthorized_access', 'data_loss', 'system_compromise', 'other')),
  affected_users_count INTEGER DEFAULT 0,
  affected_data_categories TEXT[],
  description TEXT NOT NULL,
  remediation_actions TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_incident_log_status_severity ON public.incident_log(status, severity, detected_at DESC);

ALTER TABLE public.incident_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage incidents"
  ON public.incident_log FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_incident_log_updated_at
  BEFORE UPDATE ON public.incident_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Helper function: check active consent
CREATE OR REPLACE FUNCTION public.has_active_consent(_user_id UUID, _consent_type TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT granted AND revoked_at IS NULL
      FROM public.consent_records
      WHERE user_id = _user_id
        AND consent_type = _consent_type
      ORDER BY granted_at DESC
      LIMIT 1
    ),
    false
  );
$$;

-- 6. Function to schedule account deletion (called by edge function)
CREATE OR REPLACE FUNCTION public.request_account_deletion(_reason TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_scheduled TIMESTAMPTZ := now() + interval '30 days';
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Insert deletion request
  INSERT INTO public.data_deletion_requests (user_id, scheduled_deletion_at, reason)
  VALUES (auth.uid(), v_scheduled, _reason)
  RETURNING id INTO v_request_id;

  -- Mark profile as pending deletion
  UPDATE public.profiles
  SET deletion_requested_at = now(),
      scheduled_deletion_at = v_scheduled
  WHERE id = auth.uid();

  RETURN v_request_id;
END;
$$;

-- 7. Function to cancel pending deletion
CREATE OR REPLACE FUNCTION public.cancel_account_deletion()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.data_deletion_requests
  SET status = 'cancelled'
  WHERE user_id = auth.uid() AND status = 'pending';

  UPDATE public.profiles
  SET deletion_requested_at = NULL,
      scheduled_deletion_at = NULL
  WHERE id = auth.uid();

  RETURN true;
END;
$$;
