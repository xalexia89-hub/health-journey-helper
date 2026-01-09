-- Pilot enrollment tracking table
CREATE TABLE public.pilot_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  consent_accepted BOOLEAN NOT NULL DEFAULT false,
  consent_accepted_at TIMESTAMP WITH TIME ZONE,
  age_confirmed BOOLEAN NOT NULL DEFAULT false,
  invite_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'waitlist', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Pilot waitlist for when 100 users is reached
CREATE TABLE public.pilot_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pilot settings (admin configurable)
CREATE TABLE public.pilot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default pilot settings
INSERT INTO public.pilot_settings (setting_key, setting_value) VALUES 
  ('max_pilot_users', '100'),
  ('pilot_active', 'true'),
  ('require_invite_code', 'false');

-- Doctor advisor agreements (pilot specific)
CREATE TABLE public.doctor_advisor_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  no_patient_relationship_acknowledged BOOLEAN NOT NULL DEFAULT false,
  unpaid_volunteer_acknowledged BOOLEAN NOT NULL DEFAULT false,
  navigation_only_acknowledged BOOLEAN NOT NULL DEFAULT false,
  public_listing_opted_in BOOLEAN NOT NULL DEFAULT false,
  bio TEXT,
  languages TEXT[] DEFAULT '{"Ελληνικά"}'::TEXT[],
  availability_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id)
);

-- Doctor access audit log
CREATE TABLE public.doctor_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_user_id UUID NOT NULL,
  patient_user_id UUID NOT NULL,
  access_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS on all new tables
ALTER TABLE public.pilot_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_advisor_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pilot_enrollments
CREATE POLICY "Users can view own enrollment"
  ON public.pilot_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollment"
  ON public.pilot_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment"
  ON public.pilot_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all enrollments"
  ON public.pilot_enrollments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for pilot_waitlist (anyone can insert, admins can view)
CREATE POLICY "Anyone can join waitlist"
  ON public.pilot_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view waitlist"
  ON public.pilot_waitlist FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for pilot_settings (admins only)
CREATE POLICY "Admins can manage settings"
  ON public.pilot_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view settings"
  ON public.pilot_settings FOR SELECT
  USING (true);

-- RLS Policies for doctor_advisor_agreements
CREATE POLICY "Doctors can manage own agreement"
  ON public.doctor_advisor_agreements FOR ALL
  USING (EXISTS (
    SELECT 1 FROM providers WHERE providers.id = doctor_advisor_agreements.provider_id AND providers.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all agreements"
  ON public.doctor_advisor_agreements FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for doctor_access_logs
CREATE POLICY "Doctors can view own logs"
  ON public.doctor_access_logs FOR SELECT
  USING (auth.uid() = doctor_user_id);

CREATE POLICY "Admins can view all logs"
  ON public.doctor_access_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Function to check pilot enrollment count
CREATE OR REPLACE FUNCTION public.get_pilot_enrollment_count()
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM pilot_enrollments WHERE status = 'active';
$$;

-- Function to check if pilot is full
CREATE OR REPLACE FUNCTION public.is_pilot_full()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT COUNT(*) FROM pilot_enrollments WHERE status = 'active'
  ) >= (
    SELECT setting_value::INTEGER FROM pilot_settings WHERE setting_key = 'max_pilot_users'
  );
$$;

-- Trigger for updated_at
CREATE TRIGGER update_pilot_enrollments_updated_at
  BEFORE UPDATE ON public.pilot_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_advisor_agreements_updated_at
  BEFORE UPDATE ON public.doctor_advisor_agreements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();