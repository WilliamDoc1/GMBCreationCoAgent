-- Add subscription columns to tenants table
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Update existing tenants to the starter plan
UPDATE public.tenants SET plan_type = 'starter' WHERE plan_type IS NULL;