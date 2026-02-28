import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { businessName, industry, instructions, context } = await req.json()
    
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set in Supabase secrets." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 so the client can handle the error message gracefully
      })
    }

    const prompt = `
      Business Name: ${businessName}
      Industry: ${industry}
      Business Context: ${context || 'Not provided'}
      
      Task: ${instructions || 'Draft a friendly greeting.'}
      
      Tone: Professional and friendly.
      Constraint: If generating a message, keep it under 160 characters. 
      Do NOT include placeholders like [Link] - just write the text.
    `

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json()
    const preview = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "AI failed to generate a response."

    return new Response(JSON.stringify({ preview }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})