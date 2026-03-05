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

    if (!geminiKey) throw new Error("GEMINI_API_KEY is missing.")

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
      Format: Return ONLY a raw JSON array of strings.
      Example: ["Post 1 text", "Post 2 text", "Post 3 text"]
    `

    // Using gemini-2.5-flash as requested
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (!geminiRes.ok) {
      const errorData = await geminiRes.json()
      return new Response(JSON.stringify({ 
        error: `Google AI Error: ${errorData.error?.message || 'Unknown API error'}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const geminiData = await geminiRes.json()
    const contentText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    const jsonStart = contentText.indexOf('[')
    const jsonEnd = contentText.lastIndexOf(']')
    
    if (jsonStart === -1 || jsonEnd === -1) {
      return new Response(JSON.stringify({ error: "Invalid AI format" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    
    const cleanJson = contentText.substring(jsonStart, jsonEnd + 1)
    const postContents = JSON.parse(cleanJson)

    const postsToInsert = postContents.slice(0, 3).map((content: string, i: number) => ({
      tenant_id: tenantId,
      content: content.trim(),
      status: 'pending',
      scheduled_for: new Date(Date.now() + (i * 2 * 24 * 60 * 60 * 1000)).toISOString()
    }))

    const { data, error } = await supabase.from('posts').insert(postsToInsert).select()
    if (error) throw error

    return new Response(JSON.stringify({ success: true, posts: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})