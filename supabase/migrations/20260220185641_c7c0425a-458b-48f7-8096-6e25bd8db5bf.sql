
-- 1. Link insurance_members to real users (nullable for legacy/mock entries)
ALTER TABLE public.insurance_members 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2. Insurance data consent table
CREATE TABLE public.insurance_data_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  org_id uuid NOT NULL REFERENCES public.insurance_organizations(id) ON DELETE CASCADE,
  
  -- Granular consent scopes
  consent_risk_scores boolean NOT NULL DEFAULT false,
  consent_claims_summary boolean NOT NULL DEFAULT false,
  consent_chronic_conditions boolean NOT NULL DEFAULT false,
  consent_wearable_trends boolean NOT NULL DEFAULT false,
  
  consented_at timestamp with time zone NOT NULL DEFAULT now(),
  revoked_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, org_id)
);

-- 3. Enable RLS
ALTER TABLE public.insurance_data_consents ENABLE ROW LEVEL SECURITY;

-- 4. Patient policies: manage own consents
CREATE POLICY "Patients can view own insurance consents"
ON public.insurance_data_consents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Patients can create insurance consents"
ON public.insurance_data_consents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients can update own insurance consents"
ON public.insurance_data_consents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Patients can delete own insurance consents"
ON public.insurance_data_consents FOR DELETE
USING (auth.uid() = user_id);

-- 5. Insurance org members can view consents for their org
CREATE POLICY "Org members can view org consents"
ON public.insurance_data_consents FOR SELECT
USING (EXISTS (
  SELECT 1 FROM insurance_org_members
  WHERE insurance_org_members.org_id = insurance_data_consents.org_id
    AND insurance_org_members.user_id = auth.uid()
));

-- 6. Admins full access
CREATE POLICY "Admins can manage all consents"
ON public.insurance_data_consents FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- 7. Aggregation view: security definer function to pull consented patient data
CREATE OR REPLACE FUNCTION public.get_insurance_member_aggregate(_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb := '{}'::jsonb;
  member_user_id uuid;
  member_org_id uuid;
  consent_rec record;
BEGIN
  -- Get member's user_id and org_id
  SELECT user_id, org_id INTO member_user_id, member_org_id
  FROM insurance_members
  WHERE id = _member_id;
  
  -- If no linked user, return empty
  IF member_user_id IS NULL THEN
    RETURN result;
  END IF;
  
  -- Get active consent
  SELECT * INTO consent_rec
  FROM insurance_data_consents
  WHERE user_id = member_user_id
    AND org_id = member_org_id
    AND is_active = true;
  
  IF consent_rec IS NULL THEN
    RETURN result;
  END IF;
  
  -- Risk scores & compliance
  IF consent_rec.consent_risk_scores THEN
    SELECT jsonb_build_object(
      'medication_adherence', COALESCE(
        (SELECT ROUND(
          COUNT(*) FILTER (WHERE status = 'taken')::numeric / 
          NULLIF(COUNT(*)::numeric, 0) * 100
        ) FROM medication_logs WHERE user_id = member_user_id 
          AND scheduled_time > now() - interval '90 days'), 0),
      'activity_score', COALESCE(
        (SELECT ROUND(AVG(duration_minutes)::numeric) 
         FROM activity_logs WHERE user_id = member_user_id
           AND logged_at > now() - interval '30 days'), 0),
      'stress_avg', COALESCE(
        (SELECT ROUND(AVG(stress_level)::numeric)
         FROM stress_logs WHERE user_id = member_user_id
           AND logged_at > now() - interval '30 days'), 0)
    ) INTO result;
    result := result || jsonb_build_object('risk_data', result);
  END IF;
  
  -- Claims summary (ER visits etc from symptom_entries urgency)
  IF consent_rec.consent_claims_summary THEN
    result := result || jsonb_build_object('claims_summary', jsonb_build_object(
      'er_related_symptoms', COALESCE(
        (SELECT COUNT(*) FROM symptom_entries 
         WHERE user_id = member_user_id 
           AND urgency_level IN ('high', 'emergency')
           AND created_at > date_trunc('year', now())), 0),
      'total_appointments', COALESCE(
        (SELECT COUNT(*) FROM appointments
         WHERE patient_id = member_user_id
           AND created_at > date_trunc('year', now())), 0)
    ));
  END IF;
  
  -- Chronic conditions
  IF consent_rec.consent_chronic_conditions THEN
    result := result || jsonb_build_object('chronic_conditions', COALESCE(
      (SELECT chronic_conditions FROM medical_records WHERE user_id = member_user_id),
      '{}'));
  END IF;
  
  -- Wearable trends (aggregated, not raw)
  IF consent_rec.consent_wearable_trends THEN
    result := result || jsonb_build_object('wearable_trends', jsonb_build_object(
      'avg_heart_rate_30d', COALESCE(
        (SELECT ROUND(AVG(bpm)::numeric) FROM wearable_heart_rate
         WHERE user_id = member_user_id AND measured_at > now() - interval '30 days'), 0),
      'avg_daily_steps_30d', COALESCE(
        (SELECT ROUND(AVG(step_count)::numeric) FROM wearable_steps
         WHERE user_id = member_user_id AND recorded_at > now() - interval '30 days'), 0),
      'avg_spo2_30d', COALESCE(
        (SELECT ROUND(AVG(spo2_value)::numeric, 1) FROM wearable_spo2
         WHERE user_id = member_user_id AND measured_at > now() - interval '30 days'), 0),
      'latest_bp', COALESCE(
        (SELECT jsonb_build_object('systolic', systolic, 'diastolic', diastolic)
         FROM wearable_blood_pressure WHERE user_id = member_user_id
         ORDER BY measured_at DESC LIMIT 1), '{}'::jsonb)
    ));
  END IF;
  
  RETURN result;
END;
$$;

-- 8. Trigger for updated_at
CREATE TRIGGER update_insurance_data_consents_updated_at
BEFORE UPDATE ON public.insurance_data_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
