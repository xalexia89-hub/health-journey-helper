
DROP VIEW IF EXISTS public.agent_performance CASCADE;

CREATE TABLE IF NOT EXISTS public.agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_type text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'alert_sent','appointment_suggested','protocol_adjusted',
    'memory_stored','physician_notified','risk_flag_raised','prescription_reviewed'
  )),
  reasoning text,
  action_data jsonb DEFAULT '{}'::jsonb,
  human_approved boolean,
  session_id uuid REFERENCES public.agent_sessions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS agent_actions_patient_idx ON public.agent_actions(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS agent_actions_type_idx ON public.agent_actions(action_type, created_at DESC);

ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own agent actions" ON public.agent_actions FOR SELECT
  USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service inserts agent actions" ON public.agent_actions FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.pending_agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_type text NOT NULL,
  action_type text NOT NULL,
  action_data jsonb DEFAULT '{}'::jsonb,
  reasoning text,
  risk_level text NOT NULL CHECK (risk_level IN ('low','medium','high','critical')),
  requires_approval_from text NOT NULL CHECK (requires_approval_from IN ('patient','physician','admin')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','expired','executed')),
  approved_by uuid REFERENCES public.profiles(id),
  approved_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pending_actions_patient_idx ON public.pending_agent_actions(patient_id, status);
CREATE INDEX IF NOT EXISTS pending_actions_status_idx ON public.pending_agent_actions(status, expires_at);

ALTER TABLE public.pending_agent_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patient sees own pending" ON public.pending_agent_actions FOR SELECT
  USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin')
    OR (requires_approval_from = 'physician' AND public.has_role(auth.uid(), 'doctor')));
CREATE POLICY "Patient approves own pending" ON public.pending_agent_actions FOR UPDATE
  USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin')
    OR (requires_approval_from = 'physician' AND public.has_role(auth.uid(), 'doctor')));
CREATE POLICY "Service inserts pending" ON public.pending_agent_actions FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));

CREATE VIEW public.agent_performance AS
SELECT
  task,
  model_used,
  COUNT(*) AS total_calls,
  ROUND(AVG(latency_ms)::numeric, 0) AS avg_latency_ms,
  SUM(tokens_input + tokens_output) AS total_tokens,
  SUM(cost_usd) AS total_cost_usd,
  COUNT(*) FILTER (WHERE error IS NOT NULL) AS error_count,
  DATE_TRUNC('day', created_at) AS day
FROM public.ai_observability
GROUP BY task, model_used, DATE_TRUNC('day', created_at);
