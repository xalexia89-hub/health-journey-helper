
-- Enable pgvector for semantic memory
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- LAYER 2: PATIENT MEMORY (semantic long-term)
-- ============================================
CREATE TABLE public.patient_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_type text NOT NULL CHECK (memory_type IN (
    'health_fact','observed_pattern','preference','concern','milestone','agent_hypothesis'
  )),
  content text NOT NULL,
  embedding vector(768),
  confidence real DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  source text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_reinforced_at timestamptz DEFAULT now()
);

CREATE INDEX patient_memory_patient_idx ON public.patient_memory(patient_id) WHERE is_active = true;
CREATE INDEX patient_memory_type_idx ON public.patient_memory(patient_id, memory_type) WHERE is_active = true;
CREATE INDEX patient_memory_embedding_idx ON public.patient_memory
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.patient_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own memory"
  ON public.patient_memory FOR SELECT
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Users insert own memory"
  ON public.patient_memory FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users update own memory"
  ON public.patient_memory FOR UPDATE
  USING (auth.uid() = patient_id);

CREATE POLICY "Admins full access memory"
  ON public.patient_memory FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- AGENT SESSIONS (short-term context window)
-- ============================================
CREATE TABLE public.agent_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_type text NOT NULL,
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  messages jsonb DEFAULT '[]'::jsonb,
  context_snapshot jsonb DEFAULT '{}'::jsonb,
  outcomes jsonb DEFAULT '{}'::jsonb,
  tokens_used int DEFAULT 0,
  model_used text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX agent_sessions_patient_idx ON public.agent_sessions(patient_id, agent_type, session_start DESC);

ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own sessions"
  ON public.agent_sessions FOR SELECT
  USING (auth.uid() = patient_id OR public.can_access_patient_medical_data(auth.uid(), patient_id));

CREATE POLICY "Users insert own sessions"
  ON public.agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users update own sessions"
  ON public.agent_sessions FOR UPDATE
  USING (auth.uid() = patient_id);

CREATE POLICY "Admins full access sessions"
  ON public.agent_sessions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- LAYER 6: AI OBSERVABILITY
-- ============================================
CREATE TABLE public.ai_observability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  model_used text NOT NULL,
  patient_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  tokens_input int DEFAULT 0,
  tokens_output int DEFAULT 0,
  latency_ms int,
  cost_usd numeric(10,6),
  status text DEFAULT 'success' CHECK (status IN ('success','error','timeout','rate_limited')),
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ai_observability_task_idx ON public.ai_observability(task, created_at DESC);
CREATE INDEX ai_observability_model_idx ON public.ai_observability(model_used, created_at DESC);
CREATE INDEX ai_observability_patient_idx ON public.ai_observability(patient_id, created_at DESC) WHERE patient_id IS NOT NULL;

ALTER TABLE public.ai_observability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view observability"
  ON public.ai_observability FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own observability"
  ON public.ai_observability FOR SELECT
  USING (auth.uid() = patient_id);

-- Performance dashboard view
CREATE OR REPLACE VIEW public.agent_performance AS
SELECT
  task,
  model_used,
  date_trunc('day', created_at) AS day,
  count(*) AS total_calls,
  avg(latency_ms)::int AS avg_latency_ms,
  sum(tokens_input + tokens_output) AS total_tokens,
  sum(cost_usd) AS total_cost_usd,
  count(*) FILTER (WHERE status = 'error') AS error_count,
  round(100.0 * count(*) FILTER (WHERE status = 'success') / nullif(count(*), 0), 2) AS success_rate
FROM public.ai_observability
GROUP BY task, model_used, date_trunc('day', created_at);

-- ============================================
-- SEMANTIC SEARCH FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.match_patient_memories(
  p_patient_id uuid,
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  memory_type text,
  content text,
  confidence real,
  source text,
  similarity float,
  created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pm.id,
    pm.memory_type,
    pm.content,
    pm.confidence,
    pm.source,
    1 - (pm.embedding <=> query_embedding) AS similarity,
    pm.created_at
  FROM public.patient_memory pm
  WHERE pm.patient_id = p_patient_id
    AND pm.is_active = true
    AND pm.embedding IS NOT NULL
    AND 1 - (pm.embedding <=> query_embedding) > match_threshold
    AND (
      auth.uid() = pm.patient_id
      OR public.can_access_patient_medical_data(auth.uid(), pm.patient_id)
    )
  ORDER BY pm.embedding <=> query_embedding
  LIMIT match_count;
$$;
