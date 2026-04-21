-- ============================================================
-- HOLISTIC PATIENT INTELLIGENCE — DB layer
-- ============================================================

-- 1) patient_health_profiles (lifestyle)
CREATE TABLE IF NOT EXISTS public.patient_health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  smoking TEXT,                 -- 'yes' | 'no' | 'former'
  alcohol TEXT,                 -- 'none' | 'occasional' | 'regular'
  exercise_frequency TEXT,      -- 'never' | '1-2x' | '3-4x' | 'daily'
  diet_notes TEXT,
  sleep_hours NUMERIC,
  stress_level TEXT,            -- 'low' | 'medium' | 'high'
  work_type TEXT,               -- 'sedentary' | 'mixed' | 'physical'
  wearable_device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own lifestyle"
  ON public.patient_health_profiles FOR SELECT
  USING (auth.uid() = user_id OR public.can_access_patient_medical_data(auth.uid(), user_id));

CREATE POLICY "Patients insert own lifestyle"
  ON public.patient_health_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients update own lifestyle"
  ON public.patient_health_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Patients delete own lifestyle"
  ON public.patient_health_profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_patient_health_profiles_updated
  BEFORE UPDATE ON public.patient_health_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) context_cache
CREATE TABLE IF NOT EXISTS public.context_cache (
  patient_id UUID PRIMARY KEY,
  context_data JSONB NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.context_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access own or consented context"
  ON public.context_cache FOR SELECT
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Patient or consented can write context"
  ON public.context_cache FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Patient or consented can update context"
  ON public.context_cache FOR UPDATE
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

-- 3) health_scores
CREATE TABLE IF NOT EXISTS public.health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  factors JSONB,
  top_recommendations JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_scores_patient ON public.health_scores(patient_id, calculated_at DESC);

ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own or consented health scores"
  ON public.health_scores FOR SELECT
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Patient inserts own health scores"
  ON public.health_scores FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- 4) drug_interaction_logs
CREATE TABLE IF NOT EXISTS public.drug_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  new_medication TEXT NOT NULL,
  current_medications JSONB,
  interactions_found JSONB,
  severity TEXT,                 -- 'none' | 'mild' | 'moderate' | 'severe'
  patient_acknowledged BOOLEAN NOT NULL DEFAULT false,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drug_logs_patient ON public.drug_interaction_logs(patient_id, checked_at DESC);

ALTER TABLE public.drug_interaction_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own or consented drug logs"
  ON public.drug_interaction_logs FOR SELECT
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Patient inserts own drug logs"
  ON public.drug_interaction_logs FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patient updates own drug logs"
  ON public.drug_interaction_logs FOR UPDATE
  USING (auth.uid() = patient_id);
