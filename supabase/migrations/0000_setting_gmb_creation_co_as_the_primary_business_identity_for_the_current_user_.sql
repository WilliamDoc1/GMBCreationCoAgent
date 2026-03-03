UPDATE public.tenants 
SET 
  business_name = 'GMB Creation Co.',
  industry = 'Digital Marketing Agency',
  business_context = 'Expert Local SEO agency in Cape Town, ZA. We specialise in Google Maps Ranking and review automation for local businesses.',
  gmb_review_link = 'https://g.page/r/gmb-creation-co-cape-town',
  message_template = 'Hi! Thanks for choosing GMB Creation Co. How would you rate our Local SEO service from 1 to 5?'
WHERE owner_id = auth.uid();