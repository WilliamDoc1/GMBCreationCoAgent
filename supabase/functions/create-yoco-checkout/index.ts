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
    const { amountInCents, description, successUrl, cancelUrl } = await req.json()
    const secretKey = Deno.env.get('YOCO_SECRET_KEY')

    if (!secretKey) {
      throw new Error("YOCO_SECRET_KEY is not configured in Supabase secrets.")
    }

    console.log(`Creating Yoco checkout for ${amountInCents} cents...`)

    const response = await fetch('https://online.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        metadata: {
          description: description
        }
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Yoco API Error:", data)
      throw new Error(data.message || "Failed to create Yoco checkout session")
    }

    return new Response(JSON.stringify({ redirectUrl: data.redirectUrl, checkoutId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Edge Function Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})