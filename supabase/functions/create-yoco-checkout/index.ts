import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { amountInCents, description, successUrl, cancelUrl } = body;
    
    // Get and trim the secret key to avoid whitespace issues
    const secretKey = Deno.env.get('YOCO_SECRET_KEY')?.trim();

    if (!secretKey) {
      console.error("Missing YOCO_SECRET_KEY environment variable");
      return new Response(JSON.stringify({ error: "Payment system configuration error (Missing API Key)." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`Initiating Yoco checkout for ${amountInCents} cents...`);

    const yocoResponse = await fetch('https://online.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amountInCents), // Ensure it's an integer
        currency: 'ZAR',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        metadata: {
          description: description
        }
      }),
    });

    const data = await yocoResponse.json();

    if (!yocoResponse.ok) {
      console.error("Yoco API Error Response:", data);
      // Return the specific error from Yoco if available
      const errorMessage = data.message || data.error || "Yoco payment gateway error";
      return new Response(JSON.stringify({ error: errorMessage, details: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: yocoResponse.status,
      });
    }

    console.log("Yoco checkout created successfully:", data.id);

    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Edge Function Exception:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})