import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tenantId, origin } = await req.json()
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const redirectUri = `https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/gmb-callback`
    
    // Scopes required for GMB posting
    const scopes = [
      'https://www.googleapis.com/auth/business.manage'
    ].join(' ')

    // We encode both tenantId and origin into the state
    const state = btoa(JSON.stringify({ tenantId, origin: origin || 'http://localhost:8080' }))

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', clientId!)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')
    authUrl.searchParams.set('state', state)

    return new Response(JSON.stringify({ url: authUrl.toString() }), {
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