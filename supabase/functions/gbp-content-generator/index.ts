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

    if (!geminiKey) throw new Error('GEMINI_API_KEY not found in Supabase secrets')

    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (!tenant) throw new Error('Business profile not found')

    const prompt = `
      Business: ${tenant.business_name}
      Industry: ${tenant.industry}
      Context: ${tenant.business_context || 'Local service provider'}
      Location: South Africa (Use ZA English: optimise, centre)
      
      Task: Generate 3 distinct Google Business Profile posts for this week to improve local SEO ranking.
      Tone: Professional, Authoritative, and Helpful.
      Constraint: Each post must be under 300 characters. 
      Format: Return ONLY a raw JSON array of strings. No markdown formatting, no "json" labels.
      Example: ["Post 1 text", "Post 2 text", "Post 3 text"]
    `

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (!geminiRes.ok) {
      const error = await geminiRes.json()
      throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`)
    }

    const geminiData = await geminiRes.json()
    let contentText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Clean up potential markdown formatting from AI
    contentText = contentText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const postContents = JSON.parse(contentText)

    if (!Array.isArray(postContents)) throw new Error('AI did not return an array of posts')

    const postsToInsert = postContents.map((content: string, i: number) => ({
      tenant_id: tenantId,
      content,
      status: 'pending',
      scheduled_for: new Date(Date.now() + (i * 2 * 24 * 60 * 60 * 1000)).toISOString()
    }))

    const { data, error } = await supabase.from('posts').insert(postsToInsert).select()
    if (error) throw error

    return new Response(JSON.stringify({ success: true, posts: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Function error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})