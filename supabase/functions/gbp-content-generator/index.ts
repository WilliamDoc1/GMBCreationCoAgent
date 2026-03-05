import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
    const { tenantId } = await req.json()
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    const geminiKey = Deno.env.get('GEMINI_API_KEY')

    if (!geminiKey) {
      return new Response(JSON.stringify({ 
        error: "GEMINI_API_KEY is missing from Supabase secrets." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      throw new Error('Business profile not found')
    }

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

    // Using the absolute stable v1 endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (!geminiRes.ok) {
      const errorData = await geminiRes.json()
      console.error("Google AI Error Details:", errorData);
      return new Response(JSON.stringify({ 
        error: `Google AI Error: ${errorData.error?.message || 'Unknown API error'}. (Status: ${geminiRes.status})` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const geminiData = await geminiRes.json()
    const contentText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    
    // Extract JSON array from the response
    const jsonStart = contentText.indexOf('[')
    const jsonEnd = contentText.lastIndexOf(']')
    
    if (jsonStart === -1 || jsonEnd === -1) {
      return new Response(JSON.stringify({ 
        error: "The AI returned an invalid format. Please try again." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    
    const cleanJson = contentText.substring(jsonStart, jsonEnd + 1)
    let postContents;
    try {
      postContents = JSON.parse(cleanJson)
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: "Failed to parse the AI's response. Please try again." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Prepare posts for insertion
    const postsToInsert = postContents.slice(0, 3).map((content: string, i: number) => ({
      tenant_id: tenantId,
      content: content.trim(),
      status: 'pending',
      scheduled_for: new Date(Date.now() + (i * 2 * 24 * 60 * 60 * 1000)).toISOString()
    }))

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert(postsToInsert)
      .select()

    if (insertError) throw insertError

    return new Response(JSON.stringify({ success: true, posts: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})