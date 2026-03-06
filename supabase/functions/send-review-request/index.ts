import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log("--- New Review Request Triggered ---");

  try {
    // 2. Parse and log the request body
    const body = await req.json();
    console.log("Request Body:", JSON.stringify(body));

    const { customerEmail, customerName, reviewLink } = body;

    if (!customerEmail || !customerName || !reviewLink) {
      console.error("Validation Error: Missing fields");
      throw new Error("Missing required fields: customerEmail, customerName, or reviewLink");
    }

    // 3. Check Environment Variables
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      console.error("Configuration Error: SMTP_PASSWORD is not set in Supabase secrets");
      throw new Error("SMTP_PASSWORD environment variable is not set");
    }
    console.log("SMTP_PASSWORD is present (length: " + smtpPassword.length + ")");

    // 4. Configure Nodemailer
    console.log("Initializing Nodemailer for william@gmbcreationco.com...");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "william@gmbcreationco.com",
        pass: smtpPassword,
      },
      // Add a timeout to prevent the function from hanging
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
    });

    // 5. Verify connection before sending
    console.log("Verifying SMTP connection...");
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP Verification Failed:", verifyError.message);
      throw new Error(`SMTP Connection Error: ${verifyError.message}`);
    }

    const mailOptions = {
      from: '"GMB Creation Co." <william@gmbcreationco.com>',
      to: customerEmail,
      subject: `Review Request for ${customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e40af;">Hi ${customerName},</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Thank you for choosing <strong>GMB Creation Co.</strong> We hope you had a great experience!
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Would you mind taking a moment to leave us a review? It helps us a lot.
          </p>
          <div style="margin: 35px 0; text-align: center;">
            <a href="${reviewLink}" 
               style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
               Leave a Review
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #eee; padding-top: 20px;">
            Best regards,<br>
            <strong>The GMB Creation Co. Team</strong>
          </p>
        </div>
      `,
    };

    // 6. Send the email
    console.log(`Attempting to send email to ${customerEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Review request sent successfully", 
        messageId: info.messageId 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (error) {
    console.error("CRITICAL ERROR in send-review-request:", error.message);
    
    // Return a structured error response
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Check Supabase Edge Function logs for full stack trace"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 400 // Return 400 so the frontend can catch the error message
      }
    )
  }
})