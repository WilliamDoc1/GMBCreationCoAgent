"use client";

import { supabase } from "@/integrations/supabase/client";

export interface YocoCheckoutResult {
  redirectUrl: string;
  checkoutId: string;
}

/**
 * Initializes a Yoco Checkout session via Supabase Edge Function.
 * This redirects the user to a secure Yoco-hosted payment page.
 */
export const initializeYocoCheckout = async (
  amountInCents: number, 
  description: string,
  planId: string
): Promise<void> => {
  try {
    const origin = window.location.origin;
    
    // Define where the user goes after payment
    // We pass the planId in the URL so we can update the DB on return
    const successUrl = `${origin}/dashboard?payment=success&plan=${planId}`;
    const cancelUrl = `${origin}/dashboard?payment=cancel`;

    const { data, error } = await supabase.functions.invoke('create-yoco-checkout', {
      body: { 
        amountInCents, 
        description,
        successUrl,
        cancelUrl
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);

    if (data.redirectUrl) {
      // Redirect the entire browser to Yoco's secure page
      window.location.href = data.redirectUrl;
    } else {
      throw new Error("No redirect URL received from Yoco");
    }
  } catch (err: any) {
    console.error("Checkout initialization failed:", err);
    throw new Error(err.message || "Could not initialize payment session");
  }
};