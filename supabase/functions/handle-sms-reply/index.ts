import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const formData = await req.formData()
    const from = formData.get('From')?.toString()
    const body = formData.get('Body')?.toString().trim()
    
    if (!from) throw new Error('Missing From number')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('phone_number', from)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')

    const lowerBody = body?.toLowerCase() || ''
    const isOptOut = ['stop', 'unsubscribe', 'cancel', 'quit'].includes(lowerBody)
    const rating = parseInt(body || '0')
    const tenant = customer.tenants
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    let responseMessage = ""
    let action = 'sentiment_reply_sent'

    if (isOptOut) {
      responseMessage = "You have been unsubscribed. You will no longer receive messages from us."
      await supabase.from('customers').update({ status: 'opted_out' }).eq('id', customer.id)
      action = 'customer_opted_out'
    } else if (rating >= 4) {
      const prompt = `Generate a professional, keyword-rich "Thank You" response for a ${rating}-star review for ${tenant.business_name} (${tenant.industry}).
      Customer: ${customer.full_name}.
      Context: ${tenant.business_context || ''}
      Constraint: Under 160 characters. Include the GMB link: ${tenant.gmb_review_link}`

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      
      const geminiData = await geminiResponse.json()
      responseMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || `Thanks for the ${rating}-star rating! Share it here: ${tenant.gmb_review_link}`
      
      await supabase.from('customers').update({ status: 'reviewed' }).eq('id', customer.id)
      await supabase.from('reviews').insert({
        tenant_id: tenant.id,
        customer_id: customer.id,
        rating,
        comment: body
      })
    } else if (rating >= 1 && rating <= 3) {
      const feedbackUrl = `https://uqqzyqgypljxvmnguhky.supabase.co/feedback?name=${encodeURIComponent(customer.full_name)}`
      responseMessage = `We're sorry to hear that. Please let us know how we can improve here: ${feedbackUrl}`
      action = 'negative_sentiment_detected'
      
      await supabase.from('reviews').insert({
        tenant_id: tenant.id,
        customer_id: customer.id,
        rating,
        comment: body
      })
    } else {
      responseMessage = "Thanks for your reply! Please rate us from 1 to 5."
    }

    // Send Reply via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER')

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: from, From: fromNumber, Body: responseMessage })
    })

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: action,
      message_content: responseMessage,
      status: 'success'
    })

    return new Response('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})