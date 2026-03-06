CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  new_tenant_id UUID;
  selected_plan TEXT;
  b_name TEXT;
BEGIN
  -- Extract metadata passed from the signup form
  selected_plan := COALESCE(new.raw_user_meta_data ->> 'plan_type', 'starter');
  b_name := COALESCE(new.raw_user_meta_data ->> 'business_name', 'My Business');

  -- Create profile
  INSERT INTO public.profiles (id, industry)
  VALUES (new.id, 'Service Provider')
  ON CONFLICT (id) DO NOTHING;

  -- Create the tenant with the selected plan
  INSERT INTO public.tenants (owner_id, business_name, industry, plan_type)
  VALUES (new.id, b_name, 'Service Provider', selected_plan)
  RETURNING id INTO new_tenant_id;

  RETURN new;
END;
$function$;