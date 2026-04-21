-- Biohacking assessments
CREATE TABLE public.biohacking_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  version int DEFAULT 1,
  completed_at timestamptz,
  -- Sleep
  sleep_hours_avg numeric,
  sleep_quality int CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_latency_minutes int,
  wake_ups_per_night int,
  feel_rested text,
  sleep_schedule_consistent boolean,
  sleep_environment text[],
  screens_before_bed boolean,
  screens_minutes_before_bed int,
  sleep_notes text,
  -- Energy
  energy_morning int CHECK (energy_morning BETWEEN 1 AND 10),
  energy_afternoon int CHECK (energy_afternoon BETWEEN 1 AND 10),
  energy_evening int CHECK (energy_evening BETWEEN 1 AND 10),
  afternoon_crash boolean,
  caffeine_cups_per_day int,
  caffeine_cutoff_hour int,
  hydration_liters numeric,
  -- Stress
  stress_level int CHECK (stress_level BETWEEN 1 AND 10),
  stress_sources text[],
  recovery_activities text[],
  meditation_minutes_per_day int,
  work_hours_per_day int,
  screen_time_hours numeric,
  nature_time_weekly_hours numeric,
  -- Context
  exercise_type text,
  exercise_days_per_week int,
  diet_type text,
  smoking boolean,
  alcohol_units_per_week int,
  hrv_device text,
  hrv_avg numeric,
  primary_goal text,
  -- AI scores
  sleep_score int,
  energy_score int,
  stress_score int,
  overall_performance_score int,
  persona_tag text,
  key_findings jsonb,
  priority_domains text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.biohacking_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own assessments"
  ON public.biohacking_assessments FOR ALL
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Admins manage all assessments"
  ON public.biohacking_assessments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authorized providers view assessments"
  ON public.biohacking_assessments FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), patient_id));

CREATE TRIGGER update_biohacking_assessments_updated_at
  BEFORE UPDATE ON public.biohacking_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Biohacking protocols
CREATE TABLE public.biohacking_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  assessment_id uuid REFERENCES public.biohacking_assessments(id) ON DELETE SET NULL,
  title text NOT NULL,
  duration_weeks int NOT NULL DEFAULT 8,
  domains text[] DEFAULT '{}',
  tier text CHECK (tier IN ('lifestyle','supplements','medical')) DEFAULT 'lifestyle',
  status text CHECK (status IN ('active','completed','paused','abandoned')) DEFAULT 'active',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  protocol_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_reasoning text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.biohacking_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own protocols"
  ON public.biohacking_protocols FOR ALL
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Admins manage all protocols"
  ON public.biohacking_protocols FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authorized providers view protocols"
  ON public.biohacking_protocols FOR SELECT
  USING (can_access_patient_medical_data(auth.uid(), patient_id));

CREATE TRIGGER update_biohacking_protocols_updated_at
  BEFORE UPDATE ON public.biohacking_protocols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Protocol interventions
CREATE TABLE public.protocol_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id uuid NOT NULL REFERENCES public.biohacking_protocols(id) ON DELETE CASCADE,
  domain text CHECK (domain IN ('sleep','energy','stress','nutrition','movement','mindfulness','supplements')),
  tier int CHECK (tier BETWEEN 1 AND 3),
  title text NOT NULL,
  description text,
  evidence_level text CHECK (evidence_level IN ('strong','moderate','emerging','anecdotal')),
  frequency text,
  duration_minutes int,
  week_start int DEFAULT 1,
  week_end int,
  is_mandatory boolean DEFAULT false,
  contraindications text[],
  mechanism text,
  reference_links text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.protocol_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own interventions"
  ON public.protocol_interventions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.biohacking_protocols p
    WHERE p.id = protocol_interventions.protocol_id
      AND p.patient_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.biohacking_protocols p
    WHERE p.id = protocol_interventions.protocol_id
      AND p.patient_id = auth.uid()
  ));

CREATE POLICY "Admins manage all interventions"
  ON public.protocol_interventions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authorized providers view interventions"
  ON public.protocol_interventions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.biohacking_protocols p
    WHERE p.id = protocol_interventions.protocol_id
      AND can_access_patient_medical_data(auth.uid(), p.patient_id)
  ));

CREATE INDEX idx_biohacking_assessments_patient ON public.biohacking_assessments(patient_id, created_at DESC);
CREATE INDEX idx_biohacking_protocols_patient ON public.biohacking_protocols(patient_id, status);
CREATE INDEX idx_protocol_interventions_protocol ON public.protocol_interventions(protocol_id);