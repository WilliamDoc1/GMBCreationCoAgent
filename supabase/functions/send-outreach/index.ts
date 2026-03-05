import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    const { customerId } = await req.json()
    
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (custError || !customer) throw new Error('Customer not found')
    const tenant = customer.tenants
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    
    const userTemplate = tenant.message_template || "Hi [Customer Name], thank you for choosing [Business Name]! We'd love to hear your feedback: [Review Link]";
    
    const prompt = `
      Business: ${tenant.business_name}
      Industry: ${tenant.industry}
      Customer Name: ${customer.full_name}
      Review Link: ${tenant.gmb_review_link}
      Website: ${tenant.website_url || 'Not provided'}
      Context: ${tenant.business_context || 'Service provider'}
      Method: ${tenant.outreach_method}
      
      User's Message Template: "${userTemplate}"
      
      Task: Process the User's Message Template. 
      1. Replace placeholders like [Customer Name] with "${customer.full_name}".
      2. Replace [Business Name] with "${tenant.business_name}".
      3. Replace [Review Link] with "${tenant.gmb_review_link}".
      4. Ensure the tone is warm and professional.
      5. Use South African English (e.g., "optimise", "centre").
      
      Format: Return JSON with "subject" (if email) and "body" keys.
    `

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiRes.json()
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      subject: `How was your experience with ${tenant.business_name}?`,
      body: userTemplate
        .replace(/\[Customer Name\]/g, customer.full_name)
        .replace(/\[Business Name\]/g, tenant.business_name)
        .replace(/\[Review Link\]/g, tenant.gmb_review_link)
    }

    if (tenant.outreach_method === 'sms') {
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: { 
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`), 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: new URLSearchParams({ 
          To: customer.phone_number, 
          From: tenant.twilio_number || Deno.env.get('TWILIO_PHONE_NUMBER') || '', 
          Body: content.body 
        })
      })
      if (!twilioRes.ok) throw new Error("Twilio failed to send SMS")
    } else {
      // EMAIL OUTREACH
      let emailSent = false;
      const provider = tenant.email_provider || 'resend';

      // 1. Try Gmail API if selected and token exists
      if (provider === 'gmail' && tenant.gmb_refresh_token) {
        try {
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
              client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
              refresh_token: tenant.gmb_refresh_token,
              grant_type: 'refresh_token',
            }),
          })

          const tokenData = await tokenResponse.json()
          if (tokenResponse.ok) {
            const accessToken = tokenData.access_token
            
            // Construct RFC 2822 message
            const utf8Subject = `=?utf-8?B?${btoa(content.subject)}?=`;
            const message = [
              `To: ${customer.email}`,
              `Subject: ${utf8Subject}`,
              'Content-Type: text/html; charset=utf-8',
              'MIME-Version: 1.0',
              '',
              content.body.replace(/\n/g, '<br>')
            ].join('\r\n');

            const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ raw: encodedMessage })
            })

            if (gmailRes.ok) {
              emailSent = true;
              console.log("Email sent via Gmail API");
            } else {
              const gmailError = await gmailRes.json();
              console.error("Gmail API failed:", gmailError);
            }
          }
        } catch (e) {
          console.error("Gmail flow error:", e);
        }
      }

      // 2. Fallback to Resend if Gmail failed or wasn't used
      if (!emailSent) {
        await sendViaResend(tenant, customer, content);
        emailSent = true;
      }
    }

    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customer.id)

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: `${tenant.outreach_method}_outreach_sent`,
      message_content: content.subject || content.body.substring(0, 50),
      status: 'success'
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Outreach Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})

async function sendViaResend(tenant: any, customer: any, content: any) {
  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) throw new Error("No email provider configured (Gmail failed and Resend key missing)")
  
  // Use from_email if provided, otherwise fallback to tenant.email, otherwise onboarding@resend.dev
  const fromEmail = tenant.from_email || tenant.email || 'onboarding@resend.dev';
  const fromName = tenant.business_name || 'Outreach Agent';
  
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`, 
      to: [customer.email],
      subject: content.subject,
      html: `<p>${content.body.replace(/\n/g, '<br>')}</p>`
    })
  })
  
  if (!emailRes.ok) {
    const err = await emailRes.json()
    throw new Error(`Resend failed: ${err.message || 'Unknown error'}`)
  }
}