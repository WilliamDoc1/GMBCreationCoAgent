-- Add email column to tenants table
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS email TEXT;

-- Drop the incorrect update policies
DROP POLICY IF EXISTS "Users can update their own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Users can update their own business info" ON public.tenants;

-- Create a correct update policy based on owner_id
CREATE POLICY "Users can update their own tenant" ON public.tenants 
FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- Ensure insert policy is correct
DROP POLICY IF EXISTS "Users can insert their own tenant" ON public.tenants;
CREATE POLICY "Users can insert their own tenant" ON public.tenants 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);