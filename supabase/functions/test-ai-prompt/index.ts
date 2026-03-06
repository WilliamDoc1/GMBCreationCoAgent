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
    
    const prompt = `
      Business Name: ${businessName}
      Industry: ${industry}
      Business Context: ${context || 'Not provided'}
      Task: ${instructions || 'Draft a friendly greeting.'}
      Tone: Professional and friendly.
      Constraint: Under 280 characters.
      Language: South African English (e.g., "optimise", "centre").
      
      IMPORTANT: 
      1. DO NOT include a "Subject:" line or any subject text. 
      2. Only provide the message body.
      3. If a URL or link is provided in the instructions, ensure it is included exactly as written.
    `

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    
    const geminiData = await geminiResponse.json()
    let preview = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "AI failed to generate content."

    // Strip any accidental "Subject:" prefix if the AI still includes it
    preview = preview.replace(/^Subject:\s*/i, '');

    return new Response(JSON.stringify({ preview }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})