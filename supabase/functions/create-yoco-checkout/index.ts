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

    // Yoco requires amount to be an integer (cents)
    const finalAmount = parseInt(String(amountInCents), 10);

    const yocoResponse = await fetch('https://online.yoco.com/api/checkouts', {
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

    const data = await yocoResponse.json();

    if (!yocoResponse.ok) {
      return new Response(JSON.stringify({ 
        error: data.message || data.error || `Yoco Error: ${yocoResponse.statusText}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: yocoResponse.status,
      });
    }

    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})