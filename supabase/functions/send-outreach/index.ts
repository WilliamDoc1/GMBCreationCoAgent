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
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    
    // Generate Email Content
    const prompt = `
      Task: Draft a professional review request email.
      Business: ${tenant.business_name}
      Customer: ${customer.full_name}
      Context: ${tenant.business_context || ''}
      Review Link: ${tenant.gmb_review_link}
      Instructions: ${tenant.message_template}
      Constraint: Include a clear Subject Line and a professional sign-off.
    `

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiResponse.json()
    const emailBody = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    // NOTE: In a production environment, you would use a service like Resend or SendGrid here.
    // For now, we log the successful "send" to the audit log and update the customer status.
    
    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customerId)

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'email_outreach_sent',
      message_content: emailBody,
      status: 'success'
    })

    return new Response(JSON.stringify({ success: true, method: 'email' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})