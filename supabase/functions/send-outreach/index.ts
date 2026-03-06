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

    // 3. SMTP Configuration
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

    // 4. Prepare Content
    const subject = `Quick question about your experience with ${tenant.business_name}`;
    
    // Styled Review Button
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

    // 5. Send Professional HTML Email
    await transporter.sendMail({
      from: `"William @ ${tenant.business_name}" <william@gmbcreationco.com>`,
      to: customer.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #2d3748;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7fa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 10px 40px;">
                        <h2 style="margin: 0; color: #1a202c; font-size: 22px; font-weight: 800; letter-spacing: -0.025em;">
                          ${tenant.business_name}
                        </h2>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px; font-size: 16px; line-height: 1.6; color: #4a5568;">
                        ${messageContent.replace(/\n/g, '<br>')}
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #edf2f7; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
                          &copy; ${new Date().getFullYear()} ${tenant.business_name}
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 11px; color: #cbd5e0;">
                          Sent via GMB Creation Co. Outreach Agent
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // 6. Update DB
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