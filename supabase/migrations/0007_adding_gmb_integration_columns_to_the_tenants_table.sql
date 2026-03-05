-- Add columns for GMB API integration
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS gmb_location_id TEXT,
ADD COLUMN IF NOT EXISTS gmb_account_id TEXT,
ADD COLUMN IF NOT EXISTS gmb_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS gmb_status TEXT DEFAULT 'disconnected';