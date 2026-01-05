
-- Add 'lab' role to app_role enum (will be available after this migration commits)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab';

-- Add 'lab' to provider_type enum  
ALTER TYPE public.provider_type ADD VALUE IF NOT EXISTS 'lab';
