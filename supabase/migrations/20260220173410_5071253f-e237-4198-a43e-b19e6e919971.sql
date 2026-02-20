
-- Blood pressure data table (requested by user)
CREATE TABLE public.wearable_blood_pressure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  pulse INTEGER,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wearable_blood_pressure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blood pressure data"
  ON public.wearable_blood_pressure FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Authorized providers can view blood pressure"
  ON public.wearable_blood_pressure FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), user_id));

CREATE INDEX idx_wearable_bp_user_date ON public.wearable_blood_pressure(user_id, measured_at DESC);
