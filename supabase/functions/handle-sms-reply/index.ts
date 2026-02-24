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
    const from = formData.get('From')
    const body = formData.get('Body')?.toString().trim()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Find the customer by phone number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('phone_number', from)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')

    const rating = parseInt(body || '0')
    const tenant = customer.tenants
    let responseMessage = ""

    if (rating >= 4) {
      // Positive Sentiment: Send GMB Link
      responseMessage = `Thanks for the ${rating}-star rating! We'd love it if you could share this on Google: ${tenant.gmb_review_link}`
      
      await supabase.from('customers').update({ status: 'reviewed' }).eq('id', customer.id)
      await supabase.from('outreach_queue').update({ status: 'completed', step: 'gmb_link_sent' }).eq('customer_id', customer.id)
    } else if (rating >= 1 && rating <= 3) {
      // Negative/Neutral Sentiment: Send Feedback Form
      responseMessage = `We're sorry to hear that. Please let us know how we can improve here: [Feedback Form Link]`
      
      await supabase.from('outreach_queue').update({ status: 'completed', step: 'feedback_requested' }).eq('customer_id', customer.id)
    } else {
      responseMessage = "Thanks for your reply! Please rate us from 1 to 5."
    }

    // 2. Send Reply via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER')

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: from,
        From: fromNumber,
        Body: responseMessage,
      })
    })

    // 3. Log the interaction
    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'sentiment_reply_sent',
      message_content: responseMessage,
      status: 'success'
    })

    return new Response('<Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})