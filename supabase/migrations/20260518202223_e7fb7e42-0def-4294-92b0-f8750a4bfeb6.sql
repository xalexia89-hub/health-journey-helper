
-- 1. Medical entry attachments: add explicit self-access fallback
DROP POLICY IF EXISTS "Users can view attachments of entries they can access" ON public.medical_entry_attachments;
CREATE POLICY "Users can view attachments of entries they can access"
ON public.medical_entry_attachments
FOR SELECT
USING (
  uploaded_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.medical_entries me
    WHERE me.id = medical_entry_attachments.entry_id
      AND (me.user_id = auth.uid() OR public.can_access_patient_medical_data(auth.uid(), me.user_id))
  )
);

-- 2. Pending agent actions: restrict doctor access to active care relationships
DROP POLICY IF EXISTS "Patient sees own pending" ON public.pending_agent_actions;
CREATE POLICY "Patient sees own pending"
ON public.pending_agent_actions
FOR SELECT
USING (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    requires_approval_from = 'physician'
    AND public.has_role(auth.uid(), 'doctor'::app_role)
    AND public.can_access_patient_medical_data(auth.uid(), patient_id)
  )
);

DROP POLICY IF EXISTS "Patient approves own pending" ON public.pending_agent_actions;
CREATE POLICY "Patient approves own pending"
ON public.pending_agent_actions
FOR UPDATE
USING (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR (
    requires_approval_from = 'physician'
    AND public.has_role(auth.uid(), 'doctor'::app_role)
    AND public.can_access_patient_medical_data(auth.uid(), patient_id)
  )
);

-- 3. Remove sensitive tables from realtime publication to prevent broadcast leakage
ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.pilot_enrollments;
