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
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 1. Get the refresh token
    const { data: tenant, error: tError } = await supabase
      .from('tenants')
      .select('gmb_refresh_token')
      .eq('id', tenantId)
      .single()

    if (tError || !tenant?.gmb_refresh_token) throw new Error("No Google connection found. Please connect first.")

    // 2. Exchange Refresh Token for Access Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        refresh_token: tenant.gmb_refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokenRes.ok) throw new Error("Failed to refresh Google token")

    // 3. Fetch Accounts
    const accountsRes = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const accountsData = await accountsRes.json()
    const account = accountsData.accounts?.[0] // Usually the first one

    if (!account) throw new Error("No Google Business accounts found.")

    // 4. Fetch Locations for that Account
    const locationsRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })
    const locationsData = await locationsRes.json()

    return new Response(JSON.stringify({ 
      accountId: account.name,
      locations: locationsData.locations || [] 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})