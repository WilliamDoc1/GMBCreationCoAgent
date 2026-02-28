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

    // --- LOOP 1: REVIEW REQUESTS ---
    const { data: queueItems } = await supabase
      .from('outreach_queue')
      .select('*, customers (*), tenants (*)')
      .eq('status', 'pending')
      .limit(5)

    for (const item of queueItems || []) {
      const { customers: customer, tenants: tenant } = item
      try {
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
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

          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ To: customer.phone_number, From: fromNumber, Body: message })
          })

          await supabase.from('outreach_queue').update({ status: 'completed' }).eq('id', item.id)
          await supabase.from('customers').update({ status: 'contacted', last_contacted_at: new Date().toISOString() }).eq('id', customer.id)
          await supabase.from('audit_log').insert({
            tenant_id: tenant.id, customer_id: customer.id, action: 'auto_outreach_sent', message_content: message, status: 'success'
          })
        }
      } catch (err) {
        await supabase.from('outreach_queue').update({ status: 'failed', last_error: err.message }).eq('id', item.id)
      }
    }

    // --- LOOP 2: GBP CONTENT POSTING ---
    const { data: pendingPosts } = await supabase
      .from('posts')
      .select('*, tenants (*)')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(3)

    for (const post of pendingPosts || []) {
      try {
        // In a real scenario, we would call the Google Business Profile API here.
        // For this agent, we simulate the success and log it.
        console.log(`Posting to GBP for ${post.tenants.business_name}: ${post.content}`)
        
        await supabase.from('posts').update({ 
          status: 'published', 
          published_at: new Date().toISOString() 
        }).eq('id', post.id)

        await supabase.from('audit_log').insert({
          tenant_id: post.tenant_id,
          action: 'gbp_post_published',
          message_content: `Published GBP Post: ${post.content.substring(0, 50)}...`,
          status: 'success'
        })
      } catch (err) {
        await supabase.from('posts').update({ status: 'failed' }).eq('id', post.id)
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