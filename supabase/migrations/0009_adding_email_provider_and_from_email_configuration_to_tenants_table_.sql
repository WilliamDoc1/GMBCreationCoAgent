-- Add email_provider and from_email columns to tenants
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS email_provider TEXT DEFAULT 'resend',
ADD COLUMN IF NOT EXISTS from_email TEXT;

-- Update existing tenants to use 'resend' as default if not set
UPDATE public.tenants SET email_provider = 'resend' WHERE email_provider IS NULL;