"use client";

/**
 * Yoco Payment Utility
 * This handles the popup checkout flow for South African ZAR payments.
 */

declare global {
  interface Window {
    YocoSDK: any;
  }
}

// INSERT YOUR KEYS HERE
// Use 'pk_test_...' for development and 'pk_live_...' for production
const YOCO_PUBLIC_KEY = "pk_test_d58cafe2V45X43ode0d4"; 

export interface YocoPaymentResult {
  id: string;
  amountInCents: number;
  currency: string;
}

export const initializeYocoPayment = (amountInCents: number, description: string): Promise<YocoPaymentResult> => {
  return new Promise((resolve, reject) => {
    if (!window.YocoSDK) {
      reject(new Error("Yoco SDK not loaded. Please check your internet connection."));
      return;
    }

    const yoco = new window.YocoSDK({
      publicKey: YOCO_PUBLIC_KEY,
    });

    yoco.showPopup({
      amountInCents: amountInCents,
      currency: 'ZAR',
      name: 'GMB Creation Co.',
      description: description,
      callback: (result: any) => {
        if (result.error) {
          // Handle specific Yoco errors
          const errorMessage = result.error.message || "Payment failed";
          reject(new Error(errorMessage));
        } else {
          // Success! Returns a charge token/id
          resolve(result);
        }
      },
    });
  });
};