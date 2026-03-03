UPDATE public.tenants 
SET 
  twilio_number = '+27870000000',
  gmb_review_link = 'https://g.page/r/gmb-creation-co-cape-town'
WHERE owner_id = auth.uid();