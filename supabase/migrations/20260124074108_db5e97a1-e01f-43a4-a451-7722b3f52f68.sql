
-- Create enum for medical entry types (if not exists)
DO $$ BEGIN
  CREATE TYPE public.medical_entry_type AS ENUM ('blood_test', 'imaging', 'diagnosis');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create medical_entries table for lab results, imaging, and diagnoses
CREATE TABLE IF NOT EXISTS public.medical_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type medical_entry_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  provider_name TEXT,
  provider_id UUID REFERENCES public.providers(id),
  symptom_session_id UUID REFERENCES public.symptom_intakes(id),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create medical_entry_attachments table for file attachments
CREATE TABLE IF NOT EXISTS public.medical_entry_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.medical_entries(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create medical_access_grants table for patient-doctor sharing
CREATE TABLE IF NOT EXISTS public.medical_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  grant_type TEXT NOT NULL DEFAULT 'temporary' CHECK (grant_type IN ('temporary', 'permanent', 'consultation')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(patient_user_id, doctor_user_id)
);

-- Create comprehensive medical_audit_logs table
CREATE TABLE IF NOT EXISTS public.medical_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  patient_user_id UUID NOT NULL REFERENCES auth.users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'upload', 'edit', 'delete', 'share', 'revoke_share', 'download')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('medical_entry', 'attachment', 'access_grant')),
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.medical_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_entry_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has access to patient's medical entries
CREATE OR REPLACE FUNCTION public.can_access_patient_medical_data(_accessor_id uuid, _patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    _accessor_id = _patient_id
    OR public.has_role(_accessor_id, 'admin')
    OR (
      public.has_role(_accessor_id, 'doctor')
      AND EXISTS (
        SELECT 1 FROM public.medical_access_grants
        WHERE patient_user_id = _patient_id
          AND doctor_user_id = _accessor_id
          AND is_active = true
          AND (expires_at IS NULL OR expires_at > now())
      )
    )
    OR (
      public.has_role(_accessor_id, 'doctor')
      AND EXISTS (
        SELECT 1 FROM public.appointments a
        JOIN public.providers p ON a.provider_id = p.id
        WHERE a.patient_id = _patient_id
          AND p.user_id = _accessor_id
          AND a.status IN ('pending', 'confirmed')
          AND a.appointment_date >= CURRENT_DATE - INTERVAL '7 days'
      )
    )
$$;

-- RLS Policies for medical_entries
CREATE POLICY "Users can view their own medical entries"
ON public.medical_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authorized users can view patient medical entries"
ON public.medical_entries FOR SELECT
USING (public.can_access_patient_medical_data(auth.uid(), user_id));

CREATE POLICY "Users can insert their own medical entries"
ON public.medical_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can insert entries for patients they have access to"
ON public.medical_entries FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'doctor')
  AND public.can_access_patient_medical_data(auth.uid(), user_id)
);

CREATE POLICY "Users can update their own medical entries"
ON public.medical_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical entries"
ON public.medical_entries FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for medical_entry_attachments
CREATE POLICY "Users can view attachments of entries they can access"
ON public.medical_entry_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.medical_entries me
    WHERE me.id = entry_id
    AND public.can_access_patient_medical_data(auth.uid(), me.user_id)
  )
);

CREATE POLICY "Users can insert attachments to their entries"
ON public.medical_entry_attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.medical_entries me
    WHERE me.id = entry_id
    AND (me.user_id = auth.uid() OR public.can_access_patient_medical_data(auth.uid(), me.user_id))
  )
  AND auth.uid() = uploaded_by
);

CREATE POLICY "Users can delete their own attachments"
ON public.medical_entry_attachments FOR DELETE
USING (uploaded_by = auth.uid());

-- RLS Policies for medical_access_grants
CREATE POLICY "Patients can view their own access grants"
ON public.medical_access_grants FOR SELECT
USING (auth.uid() = patient_user_id);

CREATE POLICY "Doctors can view grants given to them"
ON public.medical_access_grants FOR SELECT
USING (auth.uid() = doctor_user_id AND is_active = true);

CREATE POLICY "Patients can create access grants"
ON public.medical_access_grants FOR INSERT
WITH CHECK (auth.uid() = patient_user_id);

CREATE POLICY "Patients can update their own access grants"
ON public.medical_access_grants FOR UPDATE
USING (auth.uid() = patient_user_id);

CREATE POLICY "Patients can delete their own access grants"
ON public.medical_access_grants FOR DELETE
USING (auth.uid() = patient_user_id);

-- RLS Policies for medical_audit_logs
CREATE POLICY "Users can view their own audit logs"
ON public.medical_audit_logs FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = patient_user_id);

CREATE POLICY "Admins can view all audit logs"
ON public.medical_audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.medical_audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_entries_user_id ON public.medical_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_entries_entry_type ON public.medical_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_medical_entries_entry_date ON public.medical_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_entry_attachments_entry_id ON public.medical_entry_attachments(entry_id);
CREATE INDEX IF NOT EXISTS idx_medical_access_grants_patient ON public.medical_access_grants(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_medical_access_grants_doctor ON public.medical_access_grants(doctor_user_id);
CREATE INDEX IF NOT EXISTS idx_medical_audit_logs_patient ON public.medical_audit_logs(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_medical_audit_logs_created ON public.medical_audit_logs(created_at DESC);

-- Create trigger for updated_at on medical_entries
DROP TRIGGER IF EXISTS update_medical_entries_updated_at ON public.medical_entries;
CREATE TRIGGER update_medical_entries_updated_at
BEFORE UPDATE ON public.medical_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
