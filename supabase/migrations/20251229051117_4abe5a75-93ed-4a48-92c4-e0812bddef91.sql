-- Add family_history JSONB column to medical_records table
ALTER TABLE public.medical_records
ADD COLUMN family_history jsonb DEFAULT '{"grandparents": [], "parents": [], "siblings": []}'::jsonb;