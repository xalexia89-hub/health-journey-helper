CREATE TABLE IF NOT EXISTS public.navigation_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario text NOT NULL,
  routing_category text NOT NULL,
  urgency text NOT NULL,
  uncertainty text NOT NULL,
  red_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  relationships jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_critical_info jsonb NOT NULL DEFAULT '[]'::jsonb,
  questions_asked jsonb NOT NULL DEFAULT '[]'::jsonb,
  context_used jsonb NOT NULL DEFAULT '{}'::jsonb,
  routing_reason text,
  emergency_triggered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.navigation_audit_events TO authenticated;
GRANT ALL ON public.navigation_audit_events TO service_role;

ALTER TABLE public.navigation_audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own navigation audit" ON public.navigation_audit_events;
CREATE POLICY "Users view own navigation audit"
ON public.navigation_audit_events FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all navigation audit" ON public.navigation_audit_events;
CREATE POLICY "Admins view all navigation audit"
ON public.navigation_audit_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_nav_audit_user_created
  ON public.navigation_audit_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nav_audit_created
  ON public.navigation_audit_events (created_at DESC);