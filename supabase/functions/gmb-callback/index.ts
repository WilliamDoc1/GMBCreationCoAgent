import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')

  if (!code || !stateParam) {
    return new Response("Missing code or state", { status: 400 })
  }

  try {
    // Decode state to get tenantId and origin
    const { tenantId, origin } = JSON.parse(atob(stateParam))
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        redirect_uri: `https://uqqzyqgypljxvmnguhky.supabase.co/functions/v1/gmb-callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokenRes.ok) throw new Error(tokens.error_description || tokens.error)

    // Update tenant with refresh token
    const { error } = await supabase
      .from('tenants')
      .update({
        gmb_refresh_token: tokens.refresh_token,
        gmb_status: 'connected',
        updated_at: new Date().toISOString()
      })
      .eq('id', tenantId)

    if (error) throw error

    // Redirect back to the app dashboard using the origin from state
    const redirectUrl = new URL('/dashboard', origin)
    redirectUrl.searchParams.set('tab', 'settings')
    redirectUrl.searchParams.set('gmb', 'success')

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() }
    })
  } catch (error) {
    console.error("Callback Error:", error.message)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
})