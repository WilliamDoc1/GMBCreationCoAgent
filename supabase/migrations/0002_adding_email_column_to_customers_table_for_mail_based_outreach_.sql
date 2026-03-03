ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS email TEXT;

-- Update GMB Creation Co. settings to ensure everything is ready for automation
UPDATE public.tenants 
SET 
  business_name = 'GMB Creation Co.',
  industry = 'Digital Marketing Agency',
  business_context = 'Expert Local SEO agency in Cape Town, ZA. We specialise in Google Maps Ranking and review automation for local businesses.',
  gmb_review_link = 'https://g.page/r/gmb-creation-co-cape-town',
  message_template = 'Draft a professional email thanking the client for their business and asking for a 5-star review on Google.'
WHERE owner_id = auth.uid();