import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { postId, content, businessName } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')

    // Using your provided ngrok URL
    const N8N_URL = 'https://advantageous-goatishly-tanya.ngrok-free.dev/webhook-test/gbp-post-trigger';
    
    console.log(`Attempting connection to: ${N8N_URL}`);

    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, content, business_name: businessName }),
      signal: AbortSignal.timeout(8000)
    }).catch(err => {
      throw new Error(`CONNECTION_FAILED: Could not reach ngrok. Is your tunnel active? (${err.message})`);
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`N8N_ERROR (${response.status}): ${errorBody || 'No response body'}`);
    }

    // Success - Update DB
    await supabase.from('posts').update({ 
      status: 'published', 
      published_at: new Date().toISOString() 
    }).eq('id', postId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Detailed Error:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      tip: "Ensure ngrok is running and n8n is listening for a TEST event."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})