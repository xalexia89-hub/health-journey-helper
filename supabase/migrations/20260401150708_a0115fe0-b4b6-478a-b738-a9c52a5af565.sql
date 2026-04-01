
-- 1. Payments: Restrict INSERT policy to pending status only
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;
CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id AND status = 'pending'::payment_status);

-- 2. Medical Records: Replace overly permissive doctor access
DROP POLICY IF EXISTS "Doctors can view shared patient records" ON public.medical_records;
CREATE POLICY "Doctors can view shared patient records" ON public.medical_records
  FOR SELECT TO public
  USING (
    can_access_patient_medical_data(auth.uid(), user_id)
  );

-- 3. Fix broken medical-documents storage policy for doctors
DROP POLICY IF EXISTS "Doctors can view shared patient documents" ON storage.objects;
CREATE POLICY "Doctors can view shared patient documents" ON storage.objects
  FOR SELECT TO public
  USING (
    bucket_id = 'medical-documents'
    AND EXISTS (
      SELECT 1
      FROM public.medical_record_shares mrs
      JOIN public.providers p ON mrs.provider_id = p.id
      WHERE (mrs.patient_id)::text = (storage.foldername(name))[1]
        AND p.user_id = auth.uid()
        AND mrs.is_active = true
        AND (mrs.expires_at IS NULL OR mrs.expires_at > now())
    )
  );
