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
    const { postId, content, businessName } = await req.json()
    
    if (!postId || !content) {
      throw new Error("Missing postId or content in request body");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // We use the 'webhook-test' path by default as it's more reliable during development
    // when the n8n workflow might not be 'Activated' yet.
    const N8N_WEBHOOK_URL = 'https://advantageous-goatishly-tanya.ngrok-free.dev/webhook-test/gbp-post-trigger';

    console.log(`Attempting to publish post ${postId} to n8n at ${N8N_WEBHOOK_URL}`);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        content: content,
        business_name: businessName,
        timestamp: new Date().toISOString(),
        source: 'supabase-edge-function'
      }),
      // Add a timeout to prevent the function from hanging
      signal: AbortSignal.timeout(10000) 
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n Error (${response.status}):`, errorText);
      throw new Error(`n8n responded with ${response.status}. Make sure your n8n workflow is listening at /webhook-test/gbp-post-trigger`);
    }

    // Update the post status in the database only after successful n8n delivery
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString() 
      })
      .eq('id', postId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Post delivered to n8n and status updated" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Publishing Function Error:", error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check if your ngrok tunnel is active and n8n is running."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // This triggers the 'non-2xx' error in the client
    })
  }
})