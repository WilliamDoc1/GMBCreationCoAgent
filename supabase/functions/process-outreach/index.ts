import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    
    console.log("Agent Heartbeat: Starting autonomous loop...")

    // 1. Process Outreach Queue
    const { data: queueItems } = await supabase
      .from('outreach_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(5)

    for (const item of queueItems || []) {
      const outreachRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-outreach`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ customerId: item.customer_id })
      })

      if (outreachRes.ok) {
        await supabase.from('outreach_queue').update({ status: 'completed' }).eq('id', item.id)
      } else {
        const err = await outreachRes.json()
        await supabase.from('outreach_queue').update({ status: 'failed', last_error: err.error }).eq('id', item.id)
      }
    }

    // 2. Sync Reviews & Content Generation
    const { data: tenants } = await supabase.from('tenants').select('*')
    
    for (const tenant of tenants || []) {
      // Sync Reviews from Google
      if (tenant.gmb_location_id && tenant.gmb_refresh_token) {
        console.log(`Syncing reviews for: ${tenant.business_name}`)
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-gmb-reviews`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({ tenantId: tenant.id })
        })
      }

      // Check if they have enough pending posts
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
        .eq('status', 'pending')
      
      if ((count || 0) < 3) {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/gbp-content-generator`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({ tenantId: tenant.id })
        })
      }
    }

    // 3. Auto-Publish Scheduled Posts
    const now = new Date().toISOString()
    const { data: duePosts } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .limit(5)

    for (const post of duePosts || []) {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/publish-gmb`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ postId: post.id, content: post.content })
      })
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
  } catch (error) {
    console.error("Autonomous Loop Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})