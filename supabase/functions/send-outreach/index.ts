import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { customerId } = await req.json()
    
    // Self-Correction: Pulling from system environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Idempotency Check: Get customer status
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')
    
    // Exit if already contacted or reviewed
    if (customer.status === 'contacted' || customer.status === 'reviewed') {
      console.log(`Customer ${customerId} already contacted. Skipping.`)
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const tenant = customer.tenants
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const prompt = `
      Business: ${tenant.business_name}
      Customer: ${customer.full_name}
      Instructions: ${tenant.message_template || 'Ask for a 1-5 rating.'}
      Constraint: Under 160 chars.
    `

    // 2. Generate AI Message
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiResponse.json()
    const message = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

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
      body: new URLSearchParams({ To: customer.phone_number, From: fromNumber, Body: message })
    })

    // 4. Feedback Loop: Update status and log
    if (twilioResponse.ok) {
      await supabase.from('customers').update({ 
        status: 'contacted', 
        last_contacted_at: new Date().toISOString() 
      }).eq('id', customerId)

      await supabase.from('audit_log').insert({
        tenant_id: tenant.id,
        customer_id: customer.id,
        action: 'auto_outreach_sent',
        message_content: message,
        status: 'success'
      })
    } else {
      const twilioError = await twilioResponse.json()
      throw new Error(`Twilio failed: ${twilioError.message}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})