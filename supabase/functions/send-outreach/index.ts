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
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    
    // 1. Fetch Customer and Tenant details
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (custError || !customer) throw new Error('Customer not found')
    const tenant = customer.tenants

    // 2. Generate Email Content with Gemini
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const prompt = `
      Business: ${tenant.business_name}
      Industry: ${tenant.industry}
      Customer Name: ${customer.full_name}
      Review Link: ${tenant.gmb_review_link}
      Context: ${tenant.business_context || 'Service provider'}
      
      Task: Write a friendly, professional email thanking the customer for their business and asking for a Google review.
      Tone: Warm and South African (Use ZA English: "optimise", "centre").
      Format: Return JSON with "subject" and "body" keys.
    `

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiRes.json()
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Extract JSON from AI response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    const emailContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      subject: `How was your experience with ${tenant.business_name}?`,
      body: `Hi ${customer.full_name}, thank you for choosing us! We'd love to hear your feedback: ${tenant.gmb_review_link}`
    }

    // 3. Trigger n8n Email Webhook
    const N8N_EMAIL_URL = 'https://advantageous-goatishly-tanya.ngrok-free.dev/webhook-test/email-outreach';
    
    const n8nRes = await fetch(N8N_EMAIL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customer.email,
        from_name: tenant.business_name,
        subject: emailContent.subject,
        body: emailContent.body,
        customer_id: customer.id,
        tenant_id: tenant.id
      })
    })

    if (!n8nRes.ok) throw new Error("n8n failed to send email")

    // 4. Update Customer Status & Log Audit
    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customer.id)

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'email_outreach_sent',
      message_content: emailContent.subject,
      status: 'success'
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})