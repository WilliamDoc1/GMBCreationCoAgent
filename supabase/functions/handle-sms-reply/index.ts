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
    
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    const { data: customer } = await supabase.from('customers').select('*, tenants(*)').eq('phone_number', from).single()
    if (!customer) throw new Error('Customer not found')

    const rating = parseInt(body || '0')
    const tenant = customer.tenants
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    let responseMessage = ""

    if (rating >= 4) {
      const prompt = `Generate a "Thank You" response for a ${rating}-star review for ${tenant.business_name}. Link: ${tenant.gmb_review_link}. Under 160 chars.`
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      const geminiData = await geminiRes.json()
      responseMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Thanks for the review!"
    } else {
      responseMessage = "Thanks for your feedback. We'll look into this."
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: from, From: tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER'), Body: responseMessage })
    })

    return new Response('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})