
-- Drop plaintext OAuth token columns; encrypted columns remain
ALTER TABLE public.wearable_connections
  DROP COLUMN IF EXISTS access_token,
  DROP COLUMN IF EXISTS refresh_token;

-- Remove appointment_slot_locks from realtime publication if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'appointment_slot_locks'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.appointment_slot_locks';
  END IF;
END $$;
