-- Fix 1: Replace permissive patient update policy on appointments
-- Drop the old overly-permissive policy
DROP POLICY IF EXISTS "Patients can cancel own appointments" ON public.appointments;

-- Create a SECURITY DEFINER function for safe patient cancellation
CREATE OR REPLACE FUNCTION public.patient_cancel_appointment(p_appointment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.appointments
  SET status = 'cancelled', updated_at = now()
  WHERE id = p_appointment_id
    AND patient_id = auth.uid()
    AND status IN ('pending', 'confirmed');
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found or cannot be cancelled';
  END IF;
END;
$$;

-- Fix 2: Restrict likes SELECT policies to authenticated users only
DROP POLICY IF EXISTS "Everyone can view likes" ON public.academy_video_likes;
CREATE POLICY "Authenticated users can view likes"
ON public.academy_video_likes
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Everyone can view likes" ON public.community_post_likes;
CREATE POLICY "Authenticated users can view likes"
ON public.community_post_likes
FOR SELECT
TO authenticated
USING (true);