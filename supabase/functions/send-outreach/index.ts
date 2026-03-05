import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { customerId } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    const { data: customer } = await supabase.from('customers').select('*, tenants(*)').eq('id', customerId).single()
    if (!customer) throw new Error('Customer not found')

    const tenant = customer.tenants
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    
    const prompt = `Draft a short review request for ${tenant.business_name}. Link: ${tenant.gmb_review_link}. Under 160 chars.`
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    const geminiData = await geminiRes.json()
    const messageContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Please leave us a review!"

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})