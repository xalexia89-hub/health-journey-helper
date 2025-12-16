-- Create table for interest expressions (letters of intent)
CREATE TABLE public.interest_expressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  provider_type TEXT NOT NULL, -- 'doctor', 'nurse', 'clinic', 'hospital'
  specialty TEXT,
  organization_name TEXT,
  city TEXT,
  reason TEXT, -- Why they want this app
  signature_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interest_expressions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit interest expression"
ON public.interest_expressions
FOR INSERT
WITH CHECK (true);

-- Only admins can view all expressions
CREATE POLICY "Admins can view all interest expressions"
ON public.interest_expressions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update/delete
CREATE POLICY "Admins can manage interest expressions"
ON public.interest_expressions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));