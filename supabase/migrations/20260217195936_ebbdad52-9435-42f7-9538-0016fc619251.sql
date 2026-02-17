
-- Insurance Governance Layer Tables

-- 1. Create all tables first
CREATE TABLE public.insurance_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.insurance_organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.insurance_organizations(id) ON DELETE CASCADE NOT NULL,
  member_code TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  policy_type TEXT DEFAULT 'individual',
  policy_start DATE,
  policy_end DATE,
  risk_score NUMERIC(5,2) DEFAULT 50,
  stability_score NUMERIC(5,2) DEFAULT 75,
  compliance_score NUMERIC(5,2) DEFAULT 80,
  risk_category TEXT DEFAULT 'medium',
  chronic_conditions TEXT[] DEFAULT '{}',
  last_claim_date TIMESTAMPTZ,
  total_claims_amount NUMERIC(12,2) DEFAULT 0,
  er_visits_ytd INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.insurance_organizations(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.insurance_members(id) ON DELETE CASCADE NOT NULL,
  claim_code TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  diagnosis_code TEXT,
  diagnosis_description TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.insurance_organizations(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.insurance_members(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_behavioral_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.insurance_members(id) ON DELETE CASCADE NOT NULL,
  log_type TEXT NOT NULL,
  compliance_delta NUMERIC(5,2) DEFAULT 0,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.insurance_cost_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.insurance_organizations(id) ON DELETE CASCADE NOT NULL,
  period_month DATE NOT NULL,
  total_claims_cost NUMERIC(14,2) DEFAULT 0,
  predicted_claims_cost NUMERIC(14,2) DEFAULT 0,
  er_visits_avoided INTEGER DEFAULT 0,
  er_cost_saved NUMERIC(14,2) DEFAULT 0,
  chronic_stabilization_rate NUMERIC(5,2) DEFAULT 0,
  claims_reduction_pct NUMERIC(5,2) DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  high_risk_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS on all tables
ALTER TABLE public.insurance_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_behavioral_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_cost_metrics ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- insurance_organizations
CREATE POLICY "ins_org_admin" ON public.insurance_organizations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "ins_org_member_view" ON public.insurance_organizations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_organizations.id AND user_id = auth.uid()
  ));

-- insurance_org_members
CREATE POLICY "ins_orgm_self" ON public.insurance_org_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ins_orgm_admin" ON public.insurance_org_members FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- insurance_members
CREATE POLICY "ins_mem_org" ON public.insurance_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_members.org_id AND user_id = auth.uid()
  ));

CREATE POLICY "ins_mem_admin" ON public.insurance_members FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- insurance_claims
CREATE POLICY "ins_claims_org" ON public.insurance_claims FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_claims.org_id AND user_id = auth.uid()
  ));

CREATE POLICY "ins_claims_admin" ON public.insurance_claims FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- insurance_risk_alerts
CREATE POLICY "ins_alerts_org" ON public.insurance_risk_alerts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_risk_alerts.org_id AND user_id = auth.uid()
  ));

CREATE POLICY "ins_alerts_update" ON public.insurance_risk_alerts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_risk_alerts.org_id AND user_id = auth.uid()
  ));

CREATE POLICY "ins_alerts_admin" ON public.insurance_risk_alerts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- insurance_behavioral_logs
CREATE POLICY "ins_beh_org" ON public.insurance_behavioral_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_members im
    JOIN public.insurance_org_members iom ON iom.org_id = im.org_id
    WHERE im.id = insurance_behavioral_logs.member_id AND iom.user_id = auth.uid()
  ));

CREATE POLICY "ins_beh_admin" ON public.insurance_behavioral_logs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- insurance_cost_metrics
CREATE POLICY "ins_cost_org" ON public.insurance_cost_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.insurance_org_members WHERE org_id = insurance_cost_metrics.org_id AND user_id = auth.uid()
  ));

CREATE POLICY "ins_cost_admin" ON public.insurance_cost_metrics FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Triggers
CREATE TRIGGER update_insurance_organizations_updated_at
  BEFORE UPDATE ON public.insurance_organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_members_updated_at
  BEFORE UPDATE ON public.insurance_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
