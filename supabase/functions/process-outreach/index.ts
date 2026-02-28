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

    console.log("Starting autonomous agent loop...")

    // --- LOOP 1: REVIEW REQUESTS ---
    const { data: queueItems } = await supabase
      .from('outreach_queue')
      .select('*, customers (*), tenants (*)')
      .eq('status', 'pending')
      .limit(5)

    for (const item of queueItems || []) {
      const { customers: customer, tenants: tenant } = item
      try {
        const prompt = `Draft a short, friendly SMS for ${customer.full_name} from ${tenant.business_name}. 
        Industry: ${tenant.industry}. Context: ${tenant.business_context || ''}
        Instructions: ${tenant.message_template || 'Ask for a rating from 1 to 5.'}
        Constraint: Under 160 characters.`

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        
        const geminiData = await geminiResponse.json()
        const message = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (message) {
          const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
          const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
          const fromNumber = tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER')

          const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ To: customer.phone_number, From: fromNumber, Body: message })
          })

          if (!twilioRes.ok) throw new Error("Twilio API error")

          await supabase.from('outreach_queue').update({ status: 'completed' }).eq('id', item.id)
          await supabase.from('customers').update({ status: 'contacted', last_contacted_at: new Date().toISOString() }).eq('id', customer.id)
          await supabase.from('audit_log').insert({
            tenant_id: tenant.id, customer_id: customer.id, action: 'auto_outreach_sent', message_content: message, status: 'success'
          })
        }
      } catch (err) {
        await supabase.from('outreach_queue').update({ status: 'failed', last_error: err.message }).eq('id', item.id)
        await supabase.from('audit_log').insert({
          tenant_id: item.tenant_id, customer_id: item.customer_id, action: 'auto_outreach_failed', message_content: err.message, status: 'error'
        })
      }
    }

    // --- LOOP 2: GBP CONTENT GENERATION ---
    const { data: tenants } = await supabase.from('tenants').select('*')
    
    for (const tenant of tenants || []) {
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
        .eq('status', 'pending')

      if ((count || 0) < 2) {
        const prompt = `Generate a Google Business Profile post for ${tenant.business_name} (${tenant.industry}).
        Context: ${tenant.business_context || ''}
        Goal: Local SEO optimization and engagement.
        Tone: Professional and local.
        Constraint: Under 300 characters. No hashtags.`

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        
        const geminiData = await geminiResponse.json()
        const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (content) {
          await supabase.from('posts').insert({
            tenant_id: tenant.id,
            content,
            status: 'pending',
            scheduled_for: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
          })
          
          await supabase.from('audit_log').insert({
            tenant_id: tenant.id,
            action: 'gbp_post_generated',
            message_content: `AI generated a new post: ${content.substring(0, 50)}...`,
            status: 'success'
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})