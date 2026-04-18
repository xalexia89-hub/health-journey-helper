
-- Table for doctor-prescribed medications with safety analysis
CREATE TABLE public.medication_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_user_id uuid NOT NULL,
  prescribed_by_user_id uuid NOT NULL,
  medication_name text NOT NULL,
  dosage text,
  frequency text,
  duration text,
  indication text,
  doctor_notes text,
  -- AI safety check results
  side_effects text[],
  contraindications text[],
  drug_interactions jsonb DEFAULT '[]'::jsonb,
  allergy_warnings jsonb DEFAULT '[]'::jsonb,
  severity text CHECK (severity IN ('safe','caution','warning','danger')) DEFAULT 'safe',
  ai_summary text,
  ai_model text,
  safety_checked_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','discontinued','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.medication_prescriptions ENABLE ROW LEVEL SECURITY;

-- Patient can view own prescriptions
CREATE POLICY "Patients can view own prescriptions"
ON public.medication_prescriptions FOR SELECT
USING (auth.uid() = patient_user_id);

-- Doctors with access can view & manage
CREATE POLICY "Authorized doctors can view prescriptions"
ON public.medication_prescriptions FOR SELECT
USING (can_access_patient_medical_data(auth.uid(), patient_user_id));

CREATE POLICY "Authorized doctors can prescribe"
ON public.medication_prescriptions FOR INSERT
WITH CHECK (
  auth.uid() = prescribed_by_user_id
  AND has_role(auth.uid(), 'doctor'::app_role)
  AND can_access_patient_medical_data(auth.uid(), patient_user_id)
);

CREATE POLICY "Prescribing doctor can update"
ON public.medication_prescriptions FOR UPDATE
USING (auth.uid() = prescribed_by_user_id);

CREATE POLICY "Admins manage all prescriptions"
ON public.medication_prescriptions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_medication_prescriptions_updated_at
BEFORE UPDATE ON public.medication_prescriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_medication_prescriptions_patient ON public.medication_prescriptions(patient_user_id);
CREATE INDEX idx_medication_prescriptions_doctor ON public.medication_prescriptions(prescribed_by_user_id);
