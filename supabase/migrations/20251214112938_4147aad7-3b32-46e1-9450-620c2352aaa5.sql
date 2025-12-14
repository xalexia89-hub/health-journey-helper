-- Add license_number to providers table
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS registration_status text DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected'));

-- Create provider_documents table for storing certifications/diplomas
CREATE TABLE public.provider_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL, -- 'license', 'diploma', 'certification', 'id_card'
  file_name text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone,
  verified_by uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;

-- Policies for provider_documents
CREATE POLICY "Providers can view own documents"
ON public.provider_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers 
    WHERE providers.id = provider_documents.provider_id 
    AND providers.user_id = auth.uid()
  )
);

CREATE POLICY "Providers can upload own documents"
ON public.provider_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers 
    WHERE providers.id = provider_documents.provider_id 
    AND providers.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all documents"
ON public.provider_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for provider documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('provider-documents', 'provider-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for provider documents
CREATE POLICY "Providers can upload their documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can view their documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all provider documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'provider-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);