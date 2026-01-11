-- Create storage bucket for medical documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for medical documents bucket
CREATE POLICY "Users can upload their own medical documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medical-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own medical documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own medical documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'medical-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Doctors can view documents of patients who shared their records
CREATE POLICY "Doctors can view shared patient documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-documents'
  AND EXISTS (
    SELECT 1 FROM public.medical_record_shares mrs
    JOIN public.providers p ON mrs.provider_id = p.id
    WHERE mrs.patient_id::text = (storage.foldername(name))[1]
    AND p.user_id = auth.uid()
    AND mrs.is_active = true
    AND (mrs.expires_at IS NULL OR mrs.expires_at > now())
  )
);

-- Add document_category to medical_documents if not exists
ALTER TABLE public.medical_documents 
ADD COLUMN IF NOT EXISTS document_category TEXT DEFAULT 'other';

-- Policy for doctors to insert documents for their patients
CREATE POLICY "Doctors can add documents for shared patients"
ON public.medical_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.medical_record_shares mrs
    JOIN public.providers p ON mrs.provider_id = p.id
    WHERE mrs.patient_id = user_id
    AND p.user_id = auth.uid()
    AND mrs.is_active = true
  )
);