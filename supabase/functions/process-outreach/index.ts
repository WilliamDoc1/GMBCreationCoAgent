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
    const supabase = createClient(supabaseUrl, supabaseKey)
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    console.log("Starting autonomous agent control loop...")

    // 1. Fetch all tenants to scan their status
    const { data: tenants, error: tenantError } = await supabase.from('tenants').select('*')
    if (tenantError) throw tenantError

    for (const tenant of tenants || []) {
      console.log(`Scanning tenant: ${tenant.business_name}`)

      // --- TASK A: GBP POSTING (3-DAY RULE) ---
      // Check for the most recent post
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
        console.log(`Generating SEO post for ${tenant.business_name}...`)
        
        const prompt = `Generate a high-impact local SEO Google Business Profile post for ${tenant.business_name} (${tenant.industry}).
        Context: ${tenant.business_context || ''}
        Goal: Drive local engagement and rank for industry keywords.
        Constraint: Under 300 characters. No hashtags.`

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        
        const geminiData = await geminiRes.json()
        const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (content) {
          // Insert into posts table (simulating GBP publish for now)
          await supabase.from('posts').insert({
            tenant_id: tenant.id,
            content,
            status: 'published',
            published_at: new Date().toISOString()
          })

          await supabase.from('audit_log').insert({
            tenant_id: tenant.id,
            action: 'auto_gbp_post_published',
            message_content: `Autonomous SEO post published: ${content.substring(0, 50)}...`,
            status: 'success'
          })
        }
      }

      // --- TASK B: CUSTOMER OUTREACH (24H DELAY RULE) ---
      // Find customers added > 24h ago who are still 'new'
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const { data: pendingCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('status', 'new')
        .lt('created_at', twentyFourHoursAgo.toISOString())

      for (const customer of pendingCustomers || []) {
        console.log(`Triggering delayed outreach for ${customer.full_name}...`)
        
        // We invoke the existing send-outreach function for this customer
        try {
          const outreachRes = await fetch(`${supabaseUrl}/functions/v1/send-outreach`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ customerId: customer.id })
          })

          if (!outreachRes.ok) throw new Error("Outreach function failed")

          await supabase.from('audit_log').insert({
            tenant_id: tenant.id,
            customer_id: customer.id,
            action: 'auto_delayed_outreach_triggered',
            message_content: `24h delay reached. Outreach sent to ${customer.full_name}.`,
            status: 'success'
          })
        } catch (err) {
          await supabase.from('audit_log').insert({
            tenant_id: tenant.id,
            customer_id: customer.id,
            action: 'auto_delayed_outreach_failed',
            message_content: err.message,
            status: 'error'
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Control Loop Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})