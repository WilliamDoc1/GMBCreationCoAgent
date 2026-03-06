UPDATE public.tenants 
SET plan_type = 'agency', subscription_status = 'active'
WHERE owner_id IN (
  -- This subquery finds the ID for your specific email
  -- Note: In some environments, auth.users might not be directly accessible via public SQL, 
  -- but we'll attempt the update based on the owner_id link.
  SELECT id FROM auth.users WHERE email = 'Williamdoherty24@gmail.com'
);