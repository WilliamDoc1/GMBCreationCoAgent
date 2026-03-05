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
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    const { data: tenants } = await supabase.from('tenants').select('*')
    for (const tenant of tenants || []) {
      const prompt = `Generate a local SEO GBP post for ${tenant.business_name}. Under 300 chars.`
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      const geminiData = await geminiRes.json()
      const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (content) {
        await supabase.from('posts').insert({ tenant_id: tenant.id, content, status: 'published' })
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})