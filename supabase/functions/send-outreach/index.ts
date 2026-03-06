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
    
    // AI Content Generation
    const prompt = `Generate a warm outreach message for ${customer.full_name} from ${tenant.business_name}. Template: ${userTemplate}. Link: ${tenant.gmb_review_link}. Return JSON with subject and body.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiRes.json()
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      subject: `Feedback for ${tenant.business_name}`,
      body: userTemplate.replace(/\[Customer Name\]/g, customer.full_name).replace(/\[Business Name\]/g, tenant.business_name).replace(/\[Review Link\]/g, tenant.gmb_review_link)
    }

    if (tenant.outreach_method === 'sms') {
      // SMS Logic...
    } else {
      let emailSent = false;
      const provider = tenant.email_provider || 'resend';

      if (provider === 'gmail' && tenant.gmb_refresh_token) {
        console.log("Attempting Gmail API send...");
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
          const message = [
            `To: ${customer.email}`,
            `Subject: ${content.subject}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            '',
            content.body.replace(/\n/g, '<br>')
          ].join('\r\n');

          const encodedMessage = btoa(unescape(encodeURIComponent(message))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

          const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ raw: encodedMessage })
          })

          if (gmailRes.ok) {
            emailSent = true;
            console.log("Gmail send successful");
          } else {
            const err = await gmailRes.json();
            console.error("Gmail API Error:", err);
            if (err.error?.status === 'PERMISSION_DENIED') {
              throw new Error("Gmail permission denied. Please Reconnect your Google account in settings.");
            }
          }
        } else {
          console.error("Token refresh failed:", tokenData);
        }
      }

      if (!emailSent) {
        console.log("Falling back to Resend...");
        await sendViaResend(tenant, customer, content);
      }
    }

    // Update status and log
    await supabase.from('customers').update({ status: 'contacted', last_contacted_at: new Date().toISOString() }).eq('id', customer.id)
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })

  } catch (error) {
    console.error("Outreach Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 })
  }
})

async function sendViaResend(tenant: any, customer: any, content: any) {
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const fromEmail = tenant.from_email || 'onboarding@resend.dev';
  
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${tenant.business_name} <${fromEmail}>`, 
      to: [customer.email],
      subject: content.subject,
      html: content.body.replace(/\n/g, '<br>')
    })
  })
  
  if (!emailRes.ok) {
    const err = await emailRes.json()
    throw new Error(`Resend failed: ${err.message || 'Domain not verified'}`)
  }
}