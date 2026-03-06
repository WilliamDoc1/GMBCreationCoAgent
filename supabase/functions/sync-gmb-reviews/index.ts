import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tenantId } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 1. Get Tenant GMB Details
    const { data: tenant, error: tError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (tError || !tenant?.gmb_refresh_token || !tenant?.gmb_location_id) {
      throw new Error("GMB not fully connected for this tenant.")
    }

    // 2. Get Access Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        refresh_token: tenant.gmb_refresh_token,
        grant_type: 'refresh_token',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokenRes.ok) throw new Error("Failed to refresh Google token")

    // 3. Fetch Reviews from Google
    const reviewsRes = await fetch(`https://mybusiness.googleapis.com/v4/${tenant.gmb_location_id}/reviews`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const reviewsData = await reviewsRes.json()
    const googleReviews = reviewsData.reviews || []

    console.log(`Fetched ${googleReviews.length} reviews for ${tenant.business_name}`)

    for (const gReview of googleReviews) {
      const reviewerName = gReview.reviewer?.displayName;
      const rating = gReview.starRating === 'FIVE' ? 5 : 
                     gReview.starRating === 'FOUR' ? 4 : 
                     gReview.starRating === 'THREE' ? 3 : 
                     gReview.starRating === 'TWO' ? 2 : 1;
      
      // 4. Try to match with a customer who was contacted
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('tenant_id', tenantId)
        .ilike('full_name', reviewerName)
        .eq('status', 'contacted')
        .maybeSingle()

      if (customer) {
        // 5. Update Customer to 'reviewed'
        await supabase.from('customers').update({ status: 'reviewed' }).eq('id', customer.id)
        
        // 6. Insert into local reviews table if not exists
        await supabase.from('reviews').upsert({
          tenant_id: tenantId,
          customer_id: customer.id,
          rating: rating,
          comment: gReview.comment || '',
          created_at: gReview.createTime
        }, { onConflict: 'tenant_id, customer_id' })

        // 7. Log the success
        await supabase.from('audit_log').insert({
          tenant_id: tenantId,
          customer_id: customer.id,
          action: 'review_matched',
          message_content: `Matched Google review from ${reviewerName} (${rating} stars)`,
          status: 'success'
        })
      }
    }

    return new Response(JSON.stringify({ success: true, processed: googleReviews.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})