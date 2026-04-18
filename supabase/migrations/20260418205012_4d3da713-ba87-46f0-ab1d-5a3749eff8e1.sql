ALTER TABLE public.medical_document_analyses REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_document_analyses;