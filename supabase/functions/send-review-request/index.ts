import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { customerEmail, customerName, reviewLink } = await req.json();
    
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');

    if (!smtpUser || !smtpPassword) throw new Error("SMTP secrets missing");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: '"GMB Creation Co." <william@gmbcreationco.com>',
      to: customerEmail,
      subject: `Review Request for ${customerName}`,
      html: `<p>Hi ${customerName}, please leave us a review: <a href="${reviewLink}">${reviewLink}</a></p>`,
    });

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Review Request Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status: 400 
    });
  }
})