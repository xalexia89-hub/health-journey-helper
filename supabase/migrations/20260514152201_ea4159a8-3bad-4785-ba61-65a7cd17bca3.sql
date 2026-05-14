-- 1. Fix broken doctor storage policy on medical-documents bucket
DROP POLICY IF EXISTS "Doctors can view shared patient documents" ON storage.objects;

CREATE POLICY "Doctors can view shared patient documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-documents'
  AND EXISTS (
    SELECT 1
    FROM public.medical_record_shares mrs
    JOIN public.providers p ON p.id = mrs.provider_id
    WHERE p.user_id = auth.uid()
      AND mrs.is_active = true
      AND (mrs.expires_at IS NULL OR mrs.expires_at > now())
      AND (storage.foldername(storage.objects.name))[1] = mrs.patient_id::text
  )
);

-- 2. Remove sensitive medical_document_analyses from realtime broadcast
ALTER PUBLICATION supabase_realtime DROP TABLE public.medical_document_analyses;