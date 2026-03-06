ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS smtp_host TEXT,
ADD COLUMN IF NOT EXISTS smtp_port INTEGER DEFAULT 587,
ADD COLUMN IF NOT EXISTS smtp_user TEXT,
ADD COLUMN IF NOT EXISTS smtp_pass TEXT;

-- Ensure RLS allows users to update their own settings
CREATE POLICY "Users can update their own email settings" ON public.tenants
FOR UPDATE TO authenticated USING (auth.uid() = owner_id);