import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  console.log("--- Outreach Agent Triggered ---");

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { customerId } = await req.json()
    if (!customerId) throw new Error("No customerId provided")

    // 1. Fetch Data
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (custError || !customer) throw new Error(`Customer not found: ${custError?.message}`)
    const tenant = customer.tenants

    // 2. SMTP Configuration
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!smtpUser || !smtpPassword) {
      throw new Error("Missing SMTP_USER or SMTP_PASSWORD secrets in Supabase");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 3. Send Email
    const subject = `How was your experience with ${tenant.business_name}?`;
    
    // Prepare the review link as a clickable HTML anchor
    const reviewLinkHtml = `<a href="${tenant.gmb_review_link}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${tenant.gmb_review_link}</a>`;
    
    const body = (tenant.message_template || "Hi [Customer Name], thank you for choosing [Business Name]! Please leave us a review: [Review Link]")
      .replace(/\[Customer Name\]/g, customer.full_name)
      .replace(/\[Business Name\]/g, tenant.business_name)
      .replace(/\[Review Link\]/g, reviewLinkHtml);

    console.log(`Attempting send to ${customer.email} via ${smtpUser}...`);
    
    await transporter.sendMail({
      from: `"William @ ${tenant.business_name}" <william@gmbcreationco.com>`,
      to: customer.email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px;">
          ${body.replace(/\n/g, '<br>')}
        </div>
      `,
    });

    console.log("Email sent successfully!");

    // 4. Update DB
    await supabase.from('customers').update({ 
      status: 'contacted', 
      last_contacted_at: new Date().toISOString() 
    }).eq('id', customer.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Outreach Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})