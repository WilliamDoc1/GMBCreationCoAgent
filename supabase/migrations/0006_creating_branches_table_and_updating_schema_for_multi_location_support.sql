-- 1. Create branches table
CREATE TABLE public.branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_address TEXT,
  gmb_review_link TEXT,
  twilio_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for branches
CREATE POLICY "branch_tenant_isolation" ON public.branches
FOR ALL TO authenticated USING (
  tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
);

-- 4. Add branch_id to customers and posts
ALTER TABLE public.customers ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.audit_log ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- 5. Update outreach_queue to support branch context
ALTER TABLE public.outreach_queue ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;