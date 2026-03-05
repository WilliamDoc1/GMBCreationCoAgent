-- Ensure RLS is enabled on all core tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Users can view their own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Users can update their own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Users can manage their own tenant customers" ON public.customers;
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.posts;

-- 1. Tenants: Only the owner can see or edit their business profile
CREATE POLICY "tenant_owner_access" ON public.tenants
FOR ALL TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 2. Customers: Only users who own the tenant can see/edit customers
CREATE POLICY "customer_tenant_isolation" ON public.customers
FOR ALL TO authenticated
USING (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()))
WITH CHECK (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()));

-- 3. Posts: Only users who own the tenant can see/edit posts
CREATE POLICY "post_tenant_isolation" ON public.posts
FOR ALL TO authenticated
USING (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()))
WITH CHECK (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()));

-- 4. Audit Logs: Only users who own the tenant can see logs
CREATE POLICY "audit_log_tenant_isolation" ON public.audit_log
FOR SELECT TO authenticated
USING (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()));

-- 5. Outreach Queue: Only users who own the tenant can see/add to queue
CREATE POLICY "queue_tenant_isolation" ON public.outreach_queue
FOR ALL TO authenticated
USING (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()))
WITH CHECK (tenant_id IN (SELECT id FROM public.tenants WHERE owner_id = auth.uid()));