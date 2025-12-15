-- Create table for medical record sharing
CREATE TABLE public.medical_record_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(patient_id, provider_id)
);

-- Enable RLS
ALTER TABLE public.medical_record_shares ENABLE ROW LEVEL SECURITY;

-- Patients can manage their own shares
CREATE POLICY "Patients can view own shares"
ON public.medical_record_shares
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create shares"
ON public.medical_record_shares
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own shares"
ON public.medical_record_shares
FOR UPDATE
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete own shares"
ON public.medical_record_shares
FOR DELETE
USING (auth.uid() = patient_id);

-- Providers can view shares made to them
CREATE POLICY "Providers can view their shares"
ON public.medical_record_shares
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM providers 
  WHERE providers.id = medical_record_shares.provider_id 
  AND providers.user_id = auth.uid()
));

-- Update medical_records policy to allow doctors to view shared records
DROP POLICY IF EXISTS "Doctors can view patient records for appointments" ON public.medical_records;

CREATE POLICY "Doctors can view shared patient records"
ON public.medical_records
FOR SELECT
USING (
  has_role(auth.uid(), 'doctor'::app_role) AND (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN providers p ON a.provider_id = p.id
      WHERE a.patient_id = medical_records.user_id AND p.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM medical_record_shares mrs
      JOIN providers p ON mrs.provider_id = p.id
      WHERE mrs.patient_id = medical_records.user_id 
      AND p.user_id = auth.uid()
      AND mrs.is_active = true
      AND (mrs.expires_at IS NULL OR mrs.expires_at > now())
    )
  )
);