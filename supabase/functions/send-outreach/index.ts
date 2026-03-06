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

    // 1. Fetch Data
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*, tenants(*)')
      .eq('id', customerId)
      .single()

    if (custError || !customer) throw new Error(`Customer not found: ${custError?.message}`)
    const tenant = customer.tenants

    // 2. Extract First Name Only
    const firstName = customer.full_name.trim().split(' ')[0];

    // 3. Determine Email Configuration
    let transporter;
    let fromEmail = tenant.from_email || `william@gmbcreationco.com`;

    if (tenant.email_provider === 'smtp' && tenant.smtp_host) {
      transporter = nodemailer.createTransport({
        host: tenant.smtp_host,
        port: tenant.smtp_port || 587,
        secure: tenant.smtp_port === 465,
        auth: {
          user: tenant.smtp_user,
          pass: tenant.smtp_pass,
        },
        tls: { rejectUnauthorized: false }
      });
    } else if (tenant.email_provider === 'gmail' && tenant.gmb_refresh_token) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: tenant.from_email || tenant.email,
          clientId: Deno.env.get('GOOGLE_CLIENT_ID'),
          clientSecret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
          refreshToken: tenant.gmb_refresh_token,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: Deno.env.get('SMTP_USER'),
          pass: Deno.env.get('SMTP_PASSWORD'),
        },
        tls: { rejectUnauthorized: false }
      });
    }

    // 4. Prepare Content
    const subject = `Quick question about your experience with ${tenant.business_name}`;
    const reviewButtonHtml = `
      <div style="margin: 25px 0;">
        <a href="${tenant.gmb_review_link}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-family: sans-serif;">
          Leave a Review
        </a>
      </div>
    `;
    
    const messageContent = (tenant.message_template || "Hi [Customer Name], thank you for choosing [Business Name]! Please leave us a review: [Review Link]")
      .replace(/\[Customer Name\]/g, firstName)
      .replace(/\[Business Name\]/g, tenant.business_name)
      .replace(/\[Review Link\]/g, reviewButtonHtml);

    // 5. Send Email
    await transporter.sendMail({
      from: `"${tenant.business_name}" <${fromEmail}>`,
      to: customer.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f4f7fa; color: #2d3748;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    <tr><td style="padding: 40px 40px 10px 40px;"><h2 style="margin: 0;">${tenant.business_name}</h2></td></tr>
                    <tr><td style="padding: 20px 40px 40px 40px; font-size: 16px; line-height: 1.6;">${messageContent.replace(/\n/g, '<br>')}</td></tr>
                    <tr><td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center; font-size: 11px; color: #a0aec0;">&copy; ${new Date().getFullYear()} ${tenant.business_name}</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // 6. Update Customer Status
    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        status: 'contacted', 
        last_contacted_at: new Date().toISOString() 
      })
      .eq('id', customer.id);

    if (updateError) throw new Error(`Failed to update customer status: ${updateError.message}`);

    // 7. Log to Audit Log for Dashboard Visibility
    await supabase.from('audit_log').insert({
      tenant_id: tenant.id,
      customer_id: customer.id,
      action: 'manual_outreach_sent',
      message_content: `Review request email sent to ${customer.email}`,
      status: 'success'
    });

    // 8. Populate review_logs table
    await supabase.from('review_logs').insert({
      customer_name: customer.full_name,
      customer_email: customer.email,
      business_name: tenant.business_name,
      status: 'Sent'
    });

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