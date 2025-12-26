-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Everyone can view active providers" ON public.providers;

-- Create a new policy that requires authentication to view providers
CREATE POLICY "Authenticated users can view active providers" 
ON public.providers 
FOR SELECT 
USING (is_active = TRUE AND auth.uid() IS NOT NULL);