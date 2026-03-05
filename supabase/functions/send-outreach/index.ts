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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) throw new Error('Customer not found')
    
    if (customer.status === 'contacted' || customer.status === 'reviewed') {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const tenant = customer.tenants
    const method = tenant.outreach_method || 'email'
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const resendKey = Deno.env.get('RESEND_API_KEY')
    
    let messageContent = ""
    let action = ""

    if (method === 'sms') {
      // --- SMS LOGIC (TWILIO) ---
      const prompt = `
        Task: Draft a short, friendly SMS review request.
        Business: ${tenant.business_name}
        Customer: ${customer.full_name}
        Context: ${tenant.business_context || ''}
        Review Link: ${tenant.gmb_review_link}
        Constraint: Under 160 characters.
      `
      // Using the stable v1 endpoint
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      const geminiData = await geminiResponse.json()
      messageContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      action = 'sms_outreach_sent'

      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
      const fromNumber = tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER')

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: customer.phone_number, From: fromNumber, Body: messageContent })
      })
    } else {
      // --- EMAIL LOGIC (RESEND) ---
      if (!resendKey) throw new Error('RESEND_API_KEY not found in secrets')
      if (!customer.email) throw new Error('Customer email is missing')

      const prompt = `
        Task: Draft a professional review request email.
        Business: ${tenant.business_name}
        Customer: ${customer.full_name}
        Context: ${tenant.business_context || ''}
        Review Link: ${tenant.gmb_review_link}
        Constraint: Return ONLY the email body. No subject line in the text.
      `
      // Using the stable v1 endpoint
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      const geminiData = await geminiResponse.json()
      messageContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      action = 'email_outreach_sent'
      
      // Send via Resend
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: `${tenant.business_name} <onboarding@resend.dev>`, // Use your verified domain in production
          to: [customer.email],
          subject: `How was your experience with ${tenant.business_name}?`,
          html: `<div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                  ${messageContent.replace(/\n/g, '<br>')}
                  <br><br>
                  <a href="${tenant.gmb_review_link}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Leave a Review
                  </a>
                </div>`
        })
      })

      if (!resendRes.ok) {
        const error = await resendRes.json()
        throw new Error(`Resend error: ${JSON.stringify(error)}`)
      }
    }
    
    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customerId)

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: action,
      message_content: messageContent,
      status: 'success'
    })

    return new Response(JSON.stringify({ success: true, method }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Outreach Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})