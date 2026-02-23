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

    // 1. Get customer and their owner's profile
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, profiles(*)')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')

    const profile = customer.profiles
    const industry = profile?.industry || 'Service Provider'
    const reviewLink = profile?.review_link || ''

    // 2. Generate AI Message using Gemini
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const prompt = `Generate a friendly, professional SMS review request for a South African business. 
    Business Industry: ${industry}.
    Customer Name: ${customer.full_name}. 
    Review Link: ${reviewLink}.
    Context: They recently used our services. 
    Tone: Warm, local South African English (e.g., use "Lekker" or "Cheers" if appropriate but keep it professional). 
    Requirement: Must include the review link if provided.
    Constraint: Keep the entire message under 160 characters.`

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    const geminiData = await geminiResponse.json()
    const message = geminiData.candidates[0].content.parts[0].text.trim()

    // 3. Send via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

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

    // 4. Update status
    await supabase
      .from('customers')
      .update({ 
        status: 'contacted', 
        last_contacted_at: new Date().toISOString() 
      })
      .eq('id', customerId)

    await supabase
      .from('outbound_queue')
      .update({ status: 'completed' })
      .eq('customer_id', customerId)

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