-- Remove sensitive tables from realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'appointments'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.notifications;
  END IF;
END $$;

-- Encrypt OAuth tokens in wearable_connections using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.wearable_connections 
  ADD COLUMN IF NOT EXISTS access_token_encrypted bytea,
  ADD COLUMN IF NOT EXISTS refresh_token_encrypted bytea;

-- Function to encrypt and store tokens
CREATE OR REPLACE FUNCTION public.store_wearable_tokens(
  p_connection_id uuid,
  p_access_token text,
  p_refresh_token text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = 'wearable_encryption_key'
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    encryption_key := gen_random_uuid()::text;
    INSERT INTO vault.secrets (name, secret)
    VALUES ('wearable_encryption_key', encryption_key);
  END IF;

  UPDATE public.wearable_connections
  SET 
    access_token_encrypted = pgp_sym_encrypt(p_access_token, encryption_key),
    refresh_token_encrypted = pgp_sym_encrypt(p_refresh_token, encryption_key),
    access_token = NULL,
    refresh_token = NULL
  WHERE id = p_connection_id;
END;
$$;

-- Function to decrypt tokens (for edge functions via service role)
CREATE OR REPLACE FUNCTION public.get_wearable_tokens(p_connection_id uuid)
RETURNS TABLE(access_token text, refresh_token text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = 'wearable_encryption_key'
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found';
  END IF;

  RETURN QUERY
  SELECT 
    CASE 
      WHEN wc.access_token_encrypted IS NOT NULL 
      THEN pgp_sym_decrypt(wc.access_token_encrypted, encryption_key)
      ELSE wc.access_token
    END,
    CASE 
      WHEN wc.refresh_token_encrypted IS NOT NULL 
      THEN pgp_sym_decrypt(wc.refresh_token_encrypted, encryption_key)
      ELSE wc.refresh_token
    END
  FROM public.wearable_connections wc
  WHERE wc.id = p_connection_id;
END;
$$;