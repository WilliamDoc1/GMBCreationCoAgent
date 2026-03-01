import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const webhookUrl = Deno.env.get('WEBHOOK_URL') // Set this in Supabase Secrets
    const supabase = createClient(supabaseUrl, supabaseKey)
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    const body = await req.json().catch(() => ({}))
    
    // --- WEBHOOK DISPATCHER LOGIC ---
    if (body.event_type && webhookUrl) {
      console.log(`Dispatching webhook for ${body.event_type}...`)
      
      const payload = {
        tenant_id: body.payload.tenant_id,
        event: body.event_type,
        data: body.payload,
        content: body.payload.content || body.payload.full_name, // Include content or name
        timestamp: new Date().toISOString()
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      await supabase.from('audit_log').insert({
        tenant_id: body.payload.tenant_id,
        action: `webhook_dispatched_${body.event_type}`,
        message_content: `Webhook sent to ${webhookUrl}. Status: ${response.status}`,
        status: response.ok ? 'success' : 'error'
      })

      return new Response(JSON.stringify({ success: true, dispatched: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // --- AUTONOMOUS CONTROL LOOP LOGIC ---
    console.log("Starting autonomous agent control loop...")
    const { data: tenants, error: tenantError } = await supabase.from('tenants').select('*')
    if (tenantError) throw tenantError

    for (const tenant of tenants || []) {
      // GBP Posting Logic (3-day rule)
      const { data: lastPost } = await supabase
        .from('posts')
        .select('created_at')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      if (!lastPost || new Date(lastPost.created_at) < threeDaysAgo) {
        const prompt = `Generate a high-impact local SEO GBP post for ${tenant.business_name}. Context: ${tenant.business_context || ''}. Under 300 chars.`
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        const geminiData = await geminiRes.json()
        const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (content) {
          await supabase.from('posts').insert({
            tenant_id: tenant.id,
            content,
            status: 'published',
            published_at: new Date().toISOString()
          })
        }
      }

      // Delayed Outreach Logic (24h rule)
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
      const { data: pendingCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('status', 'new')
        .lt('created_at', twentyFourHoursAgo.toISOString())

      for (const customer of pendingCustomers || []) {
        await fetch(`${supabaseUrl}/functions/v1/send-outreach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ customerId: customer.id })
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})