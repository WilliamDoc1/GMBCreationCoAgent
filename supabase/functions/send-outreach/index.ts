import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get customer and their associated tenant settings
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')

    const tenant = customer.tenants
    if (!tenant) throw new Error('Business settings not found for this customer')

    const industry = tenant.industry || 'Service Provider'
    const businessName = tenant.business_name || 'Our Business'
    const customInstructions = tenant.message_template || 'Draft a short, friendly SMS. Mention their recent service and ask for a rating from 1 to 5.'

    // 2. Generate AI Message using Gemini with custom instructions
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const prompt = `
      Business Name: ${businessName}
      Industry: ${industry}
      Customer Name: ${customer.full_name}
      
      Instructions: ${customInstructions}
      
      Tone: Professional and friendly.
      Constraint: Keep the entire message under 160 characters. 
      Do NOT include placeholders like [Link] - just write the text.
    `

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    const geminiData = await geminiResponse.json()
    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('AI failed to generate message content')
    }
    const message = geminiData.candidates[0].content.parts[0].text.trim()

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

    if (!twilioResponse.ok) {
      const twilioError = await twilioResponse.json()
      throw new Error(`Twilio failed: ${twilioError.message}`)
    }

    // 4. Log the message in history
    await supabase
      .from('messages')
      .insert({
        customer_id: customerId,
        content: message,
        status: 'sent'
      })

    // 5. Update customer status
    await supabase
      .from('customers')
      .update({ 
        status: 'contacted', 
        last_contacted_at: new Date().toISOString() 
      })
      .eq('id', customerId)

    // 6. Log to Audit Log
    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'manual_outreach_sent',
      message_content: message,
      status: 'success'
    })

    return new Response(JSON.stringify({ success: true, message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in send-outreach:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})