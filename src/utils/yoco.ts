"use client";

import { supabase } from "@/integrations/supabase/client";

export interface YocoCheckoutResult {
  redirectUrl: string;
  checkoutId: string;
}

/**
 * Initializes a Yoco Checkout session via Supabase Edge Function.
 */
export const initializeYocoCheckout = async (
  amountInCents: number, 
  description: string,
  planId: string
): Promise<void> => {
  try {
    const origin = window.location.origin;
    const successUrl = `${origin}/dashboard?payment=success&plan=${planId}`;
    const cancelUrl = `${origin}/dashboard?payment=cancel`;

    const { data, error } = await supabase.functions.invoke('create-yoco-checkout', {
      body: { 
        amountInCents: Math.round(amountInCents), 
        description,
        successUrl,
        cancelUrl
      }
    });

    if (error) {
      // Try to extract the detailed error message from the function response
      let detailedError = error.message;
      try {
        const errorBody = await error.context?.json();
        if (errorBody?.error) detailedError = errorBody.error;
      } catch (e) {
        // Fallback to original error
      }
      throw new Error(detailedError);
    }

    if (data?.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      throw new Error(data?.error || "No redirect URL received from payment gateway");
    }
  } catch (err: any) {
    console.error("Checkout initialization failed:", err);
    throw new Error(err.message || "Could not initialize payment session");
  }
};