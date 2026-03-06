import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { amountInCents, description, successUrl, cancelUrl } = body;
    
    const secretKey = Deno.env.get('YOCO_SECRET_KEY')?.trim();

    if (!secretKey) {
      return new Response(JSON.stringify({ error: "YOCO_SECRET_KEY is not set in Supabase secrets." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const finalAmount = parseInt(String(amountInCents), 10);
    console.log(`[Yoco] Initializing checkout for ${finalAmount} cents. Description: ${description}`);

    // Using the standard Yoco Online API endpoint
    const yocoResponse = await fetch('https://online.yoco.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: finalAmount,
        currency: 'ZAR',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        metadata: {
          description: description
        }
      }),
    });

    const responseText = await yocoResponse.text();
    console.log(`[Yoco] Response Status: ${yocoResponse.status}`);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("[Yoco] Failed to parse response as JSON. Raw response:", responseText);
      return new Response(JSON.stringify({ 
        error: `The payment gateway returned an invalid response format (Status: ${yocoResponse.status}).` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      });
    }

    if (!yocoResponse.ok) {
      console.error("[Yoco] API Error Details:", data);
      return new Response(JSON.stringify({ 
        error: data.message || data.error || `Yoco Error: ${yocoResponse.statusText} (${yocoResponse.status})` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: yocoResponse.status,
      });
    }

    console.log("[Yoco] Checkout created successfully:", data.id);
    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("[Yoco] Edge Function Exception:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})