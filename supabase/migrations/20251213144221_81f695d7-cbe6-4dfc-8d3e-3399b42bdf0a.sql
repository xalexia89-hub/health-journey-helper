-- Add nurse to provider_type enum
ALTER TYPE provider_type ADD VALUE IF NOT EXISTS 'nurse';