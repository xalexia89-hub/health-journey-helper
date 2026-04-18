-- Table to store detected health-anxiety patterns
CREATE TABLE public.symptom_pattern_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pattern_type TEXT NOT NULL, -- 'health_anxiety' | 'real_concern' | 'mixed' | 'normal'
  confidence NUMERIC NOT NULL DEFAULT 0, -- 0..1
  search_count_7d INTEGER NOT NULL DEFAULT 0,
  search_count_30d INTEGER NOT NULL DEFAULT 0,
  unique_symptoms_7d INTEGER NOT NULL DEFAULT 0,
  recurring_symptoms TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  ai_recommendation TEXT,
  empathetic_message TEXT,
  signals JSONB DEFAULT '{}'::jsonb,
  ai_model TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.symptom_pattern_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own pattern insights"
ON public.symptom_pattern_insights FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own pattern insights"
ON public.symptom_pattern_insights FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own pattern insights"
ON public.symptom_pattern_insights FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_symptom_pattern_insights_user_generated
ON public.symptom_pattern_insights (user_id, generated_at DESC);