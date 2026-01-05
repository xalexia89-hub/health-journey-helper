
-- Create health_files table (extends medical_records concept with more structure)
CREATE TABLE public.health_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Demographics
  date_of_birth DATE,
  sex TEXT CHECK (sex IN ('male', 'female', 'other', 'prefer_not_to_say')),
  -- Lifestyle
  smoking_status TEXT CHECK (smoking_status IN ('never', 'former', 'current', 'occasional')),
  alcohol_consumption TEXT CHECK (alcohol_consumption IN ('none', 'occasional', 'moderate', 'heavy')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  -- Medical baseline
  height_cm NUMERIC,
  weight_kg NUMERIC,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  -- Onboarding status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create symptom_entries table (detailed symptom tracking)
CREATE TABLE public.symptom_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Raw input
  raw_user_input TEXT,
  -- Structured data from AI
  structured_data JSONB DEFAULT '{}',
  -- Symptom details
  body_areas TEXT[] DEFAULT '{}',
  onset_date DATE,
  duration TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  triggers TEXT[],
  -- AI analysis
  ai_summary TEXT,
  risk_flags TEXT[] DEFAULT '{}',
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
  recommended_actions TEXT[] DEFAULT '{}',
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ongoing', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create examary_reports table
CREATE TABLE public.examary_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Report content
  title TEXT NOT NULL DEFAULT 'Health Report',
  summary TEXT,
  symptom_timeline JSONB DEFAULT '[]',
  relevant_history JSONB DEFAULT '{}',
  risk_flags TEXT[] DEFAULT '{}',
  suggested_exams TEXT[] DEFAULT '{}',
  questions_for_doctor TEXT[] DEFAULT '{}',
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  share_token UUID DEFAULT gen_random_uuid(),
  share_expires_at TIMESTAMPTZ,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prevention_plans table
CREATE TABLE public.prevention_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Plan content
  recommendations JSONB DEFAULT '[]',
  screening_schedule JSONB DEFAULT '[]',
  last_generated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Based on factors
  based_on_age BOOLEAN DEFAULT TRUE,
  based_on_sex BOOLEAN DEFAULT TRUE,
  based_on_family_history BOOLEAN DEFAULT TRUE,
  based_on_conditions BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create consents table (for sharing health data)
CREATE TABLE public.consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  -- Scope
  scope TEXT NOT NULL CHECK (scope IN ('health_file', 'symptom_entries', 'examary', 'full')),
  case_id UUID, -- Optional: link to specific appointment/case
  -- Validity
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments_sandbox table
CREATE TABLE public.payments_sandbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  -- Payment details
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  description TEXT,
  -- Sandbox info
  fake_card_last4 TEXT DEFAULT '4242',
  invoice_number TEXT,
  receipt_url TEXT,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add outcome fields to appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS outcome_summary TEXT,
ADD COLUMN IF NOT EXISTS lab_results_url TEXT,
ADD COLUMN IF NOT EXISTS doctor_notes_internal TEXT;

-- Enable RLS on all new tables
ALTER TABLE public.health_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examary_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prevention_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_sandbox ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_files
CREATE POLICY "Users can manage own health file" ON public.health_files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view consented health files" ON public.health_files FOR SELECT 
USING (
  has_role(auth.uid(), 'doctor') AND 
  EXISTS (
    SELECT 1 FROM public.consents c
    JOIN public.providers p ON c.provider_id = p.id
    WHERE c.patient_id = health_files.user_id 
    AND p.user_id = auth.uid()
    AND c.is_active = true
    AND (c.scope = 'health_file' OR c.scope = 'full')
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
  )
);
CREATE POLICY "Labs can view consented health files" ON public.health_files FOR SELECT 
USING (
  has_role(auth.uid(), 'lab') AND 
  EXISTS (
    SELECT 1 FROM public.consents c
    JOIN public.providers p ON c.provider_id = p.id
    WHERE c.patient_id = health_files.user_id 
    AND p.user_id = auth.uid()
    AND c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
  )
);

-- RLS Policies for symptom_entries
CREATE POLICY "Users can manage own symptom entries" ON public.symptom_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view consented symptom entries" ON public.symptom_entries FOR SELECT 
USING (
  has_role(auth.uid(), 'doctor') AND 
  EXISTS (
    SELECT 1 FROM public.consents c
    JOIN public.providers p ON c.provider_id = p.id
    WHERE c.patient_id = symptom_entries.user_id 
    AND p.user_id = auth.uid()
    AND c.is_active = true
    AND (c.scope IN ('symptom_entries', 'full'))
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
  )
);

-- RLS Policies for examary_reports
CREATE POLICY "Users can manage own examary reports" ON public.examary_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view shared examary reports" ON public.examary_reports FOR SELECT 
USING (
  has_role(auth.uid(), 'doctor') AND 
  EXISTS (
    SELECT 1 FROM public.consents c
    JOIN public.providers p ON c.provider_id = p.id
    WHERE c.patient_id = examary_reports.user_id 
    AND p.user_id = auth.uid()
    AND c.is_active = true
    AND (c.scope IN ('examary', 'full'))
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
  )
);

-- RLS Policies for prevention_plans
CREATE POLICY "Users can manage own prevention plan" ON public.prevention_plans FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for consents
CREATE POLICY "Patients can manage own consents" ON public.consents FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view their consents" ON public.consents FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = consents.provider_id AND p.user_id = auth.uid()
  )
);

-- RLS Policies for payments_sandbox
CREATE POLICY "Users can manage own sandbox payments" ON public.payments_sandbox FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all sandbox payments" ON public.payments_sandbox FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_health_files_updated_at BEFORE UPDATE ON public.health_files
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symptom_entries_updated_at BEFORE UPDATE ON public.symptom_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_examary_reports_updated_at BEFORE UPDATE ON public.examary_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prevention_plans_updated_at BEFORE UPDATE ON public.prevention_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consents_updated_at BEFORE UPDATE ON public.consents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user to also create health_file and prevention_plan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient');
  
  INSERT INTO public.medical_records (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.health_files (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.prevention_plans (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;
