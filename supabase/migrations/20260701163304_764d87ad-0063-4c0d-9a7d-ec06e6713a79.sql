
-- 1) academy_case_studies: require authentication
DROP POLICY IF EXISTS "Everyone can view published case studies" ON public.academy_case_studies;
CREATE POLICY "Authenticated users can view published case studies"
ON public.academy_case_studies FOR SELECT
TO authenticated
USING (status = 'published'::academy_content_status);

-- 2) insurance_organizations: restrict contact info to org admins
DROP POLICY IF EXISTS "ins_org_member_view" ON public.insurance_organizations;
CREATE POLICY "ins_org_admin_view"
ON public.insurance_organizations FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.insurance_org_members m
    WHERE m.org_id = insurance_organizations.id
      AND m.user_id = auth.uid()
      AND m.role IN ('admin','owner')
  )
);

-- 3) medical_audit_logs: acting user (doctor) + admin only; drop patient cross-read
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.medical_audit_logs;
CREATE POLICY "Acting users can view their own audit actions"
ON public.medical_audit_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4) providers: revoke email/phone column read from broad access + secure RPC
REVOKE SELECT (email, phone) ON public.providers FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_provider_contact(_provider_id uuid)
RETURNS TABLE(email text, phone text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.providers p WHERE p.id = _provider_id AND p.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.provider_id = _provider_id
        AND a.patient_id = auth.uid()
        AND a.status IN ('pending','confirmed','completed')
    )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY SELECT p.email, p.phone FROM public.providers p WHERE p.id = _provider_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_provider_contact(uuid) TO authenticated;
