import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    
    // 1. Process Outreach Queue (Customers)
    const { data: queueItems } = await supabase
      .from('outreach_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(10)

    for (const item of queueItems || []) {
      // Trigger the individual outreach function
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-outreach`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ customerId: item.customer_id })
      })

      // Mark queue item as completed
      await supabase.from('outreach_queue').update({ status: 'completed' }).eq('id', item.id)
    }

    // 2. Process GBP Posts (Existing logic)
    const { data: tenants } = await supabase.from('tenants').select('*')
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    for (const tenant of tenants || []) {
      // Only generate if they have less than 3 pending posts
      const { count } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('tenant_id', tenant.id).eq('status', 'pending')
      
      if ((count || 0) < 3) {
        const prompt = `Generate a local SEO GBP post for ${tenant.business_name}. Under 300 chars.`
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })
        const geminiData = await geminiRes.json()
        const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (content) {
          await supabase.from('posts').insert({ tenant_id: tenant.id, content, status: 'pending' })
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})