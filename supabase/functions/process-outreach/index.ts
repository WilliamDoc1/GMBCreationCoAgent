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

    // 1. Fetch pending items
    const { data: queueItems, error: queueError } = await supabase
      .from('outreach_queue')
      .select(`
        *,
        customers (*),
        tenants (*)
      `)
      .eq('status', 'pending')
      .limit(10)

    if (queueError) throw queueError

    const results = []

    for (const item of queueItems) {
      const { customers: customer, tenants: tenant } = item
      
      if (customer.status !== 'new') {
        await supabase.from('outreach_queue').update({ status: 'skipped', last_error: 'Customer already contacted' }).eq('id', item.id)
        continue
      }

      try {
        // 2. Generate Message
        const geminiKey = Deno.env.get('GEMINI_API_KEY')
        const prompt = `Draft a short, friendly SMS for ${customer.full_name} from ${tenant.business_name}. 
        Industry: ${tenant.industry}.
        Context: ${tenant.business_context || ''}
        Instructions: ${tenant.message_template || 'Ask for a rating from 1 to 5.'}
        Constraint: Under 160 characters.`

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        })
        
        const geminiData = await geminiResponse.json()
        const message = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (!message) throw new Error("AI failed to generate message")

        // 3. Send via Twilio
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
        const fromNumber = tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER')

        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: customer.phone_number,
            From: fromNumber,
            Body: message,
          })
        })

        if (twilioResponse.ok) {
          await supabase.from('outreach_queue').update({ status: 'completed', step: 'initial_sent' }).eq('id', item.id)
          await supabase.from('customers').update({ status: 'contacted', last_contacted_at: new Date().toISOString() }).eq('id', customer.id)
          
          await supabase.from('audit_log').insert({
            tenant_id: tenant.id,
            customer_id: customer.id,
            action: 'auto_outreach_sent',
            message_content: message,
            status: 'success'
          })
          results.push({ id: item.id, status: 'sent' })
        } else {
          const errorData = await twilioResponse.json()
          throw new Error(errorData.message || "Twilio failed")
        }
      } catch (err) {
        await supabase.from('outreach_queue').update({ status: 'failed', last_error: err.message }).eq('id', item.id)
        await supabase.from('audit_log').insert({
          tenant_id: tenant.id,
          customer_id: customer.id,
          action: 'auto_outreach_failed',
          message_content: err.message,
          status: 'error'
        })
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})