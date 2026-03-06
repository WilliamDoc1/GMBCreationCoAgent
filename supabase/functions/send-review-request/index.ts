import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { customerEmail, customerName, reviewLink } = await req.json()

    if (!customerEmail || !customerName || !reviewLink) {
      throw new Error("Missing required fields: customerEmail, customerName, or reviewLink")
    }

    const smtpPassword = Deno.env.get('SMTP_PASSWORD')
    if (!smtpPassword) {
      throw new Error("SMTP_PASSWORD environment variable is not set")
    }

    // Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: "william@gmbcreationco.com",
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: '"GMB Creation Co." <william@gmbcreationco.com>',
      to: customerEmail,
      subject: `Review Request for ${customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${customerName},</h2>
          <p>Thank you for choosing GMB Creation Co. We hope you had a great experience!</p>
          <p>Would you mind taking a moment to leave us a review? It helps us a lot.</p>
          <div style="margin: 30px 0;">
            <a href="${reviewLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; rounded: 5px; font-weight: bold;">
               Leave a Review
            </a>
          </div>
          <p>Best regards,<br>The GMB Creation Co. Team</p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return new Response(
      JSON.stringify({ message: "Review request sent successfully", messageId: info.messageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (error) {
    console.error("Error sending review request:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})