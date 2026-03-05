import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { postId, content } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')

    // 1. Get Post and Tenant details
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*, tenants(*)')
      .eq('id', postId)
      .single()

    if (postError || !post) throw new Error('Post not found')
    const tenant = post.tenants

    if (!tenant.gmb_refresh_token || !tenant.gmb_location_id) {
      throw new Error('GMB not fully configured for this business. Please link your account in settings.')
    }

    // 2. Exchange Refresh Token for Access Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
        refresh_token: tenant.gmb_refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) throw new Error(`Google Auth Error: ${tokenData.error_description || tokenData.error}`)
    const accessToken = tokenData.access_token

    // 3. Post to Google Business Profile
    // Endpoint: https://mybusiness.googleapis.com/v4/{locationName}/localPosts
    const gmbUrl = `https://mybusiness.googleapis.com/v4/${tenant.gmb_location_id}/localPosts`
    
    const gmbResponse = await fetch(gmbUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        languageCode: "en-ZA",
        summary: content,
        callToAction: {
          actionType: "LEARN_MORE",
          url: tenant.gmb_review_link || "https://google.com"
        }
      })
    })

    if (!gmbResponse.ok) {
      const gmbError = await gmbResponse.json()
      throw new Error(`GMB API Error: ${gmbError.error?.message || 'Unknown error'}`)
    }

    // 4. Update Post Status
    await supabase.from('posts').update({ 
      status: 'published', 
      published_at: new Date().toISOString() 
    }).eq('id', postId)

    // 5. Log the action
    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      action: 'gmb_post_published',
      message_content: content.substring(0, 100) + '...',
      status: 'success',
      post_id: postId
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("GMB Publish Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})