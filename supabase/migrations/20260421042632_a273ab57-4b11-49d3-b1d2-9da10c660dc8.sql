ALTER PUBLICATION supabase_realtime ADD TABLE public.pilot_enrollments;
ALTER TABLE public.pilot_enrollments REPLICA IDENTITY FULL;