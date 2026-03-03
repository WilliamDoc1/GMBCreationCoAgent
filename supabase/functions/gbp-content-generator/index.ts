import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tenantId } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (!tenant) throw new Error('Tenant not found')

    const prompt = `
      Business: ${tenant.business_name} (GMB Creation Co.)
      Location: Cape Town, South Africa
      Mission: Automate review requests and rank #1 for "Digital Marketing Agency Cape Town".
      Task: Generate 3 distinct Google Business Profile posts for this week.
      Keywords to include: "Local SEO", "Google Maps Ranking", "Cape Town", "Digital Marketing".
      Tone: Professional, Authoritative, ZA English (optimise, centre).
      Constraint: Each post under 300 characters. Return as a JSON array of strings.
    `

    const geminiRes = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${geminiKey}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    })
    
    const geminiData = await geminiRes.json()
    const contentText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
    const postContents = JSON.parse(contentText)

    const postsToInsert = postContents.map((content: string, i: number) => ({
      tenant_id: tenantId,
      content,
      status: 'pending',
      scheduled_for: new Date(Date.now() + (i * 2 * 24 * 60 * 60 * 1000)).toISOString() // Spread over the week
    }))

    const { data, error } = await supabase.from('posts').insert(postsToInsert).select()
    if (error) throw error

    return new Response(JSON.stringify({ success: true, posts: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})