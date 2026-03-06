import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { customerId } = await req.json()
    if (!customerId) throw new Error("No customerId provided")

    // 1. Fetch Customer and Tenant Data
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (custError || !customer) throw new Error(`Customer not found: ${custError?.message}`)
    const tenant = customer.tenants

    // 2. Prepare Content
    const subject = `How was your experience with ${tenant.business_name}?`;
    const body = (tenant.message_template || "Hi [Customer Name], thank you for choosing [Business Name]! We'd love to hear your feedback: [Review Link]")
      .replace(/\[Customer Name\]/g, customer.full_name)
      .replace(/\[Business Name\]/g, tenant.business_name)
      .replace(/\[Review Link\]/g, tenant.gmb_review_link);

    // 3. Send via SMTP (Gmail)
    const smtpPassword = Deno.env.get('SMTP_PASSWORD')
    if (!smtpPassword) throw new Error("SMTP_PASSWORD secret is missing in Supabase")

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "william@gmbcreationco.com",
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"William @ ${tenant.business_name}" <william@gmbcreationco.com>`,
      to: customer.email,
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
    });

    // 4. Update Database
    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customer.id)

    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'email_outreach_sent',
      message_content: subject,
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