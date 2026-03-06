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

// Use 'pk_test_...' for development and 'pk_live_...' for production
const YOCO_PUBLIC_KEY = "pk_test_d58cafe2V45X43ode0d4"; 

export interface YocoPaymentResult {
  id: string;
  amountInCents: number;
  currency: string;
}

/**
 * Dynamically loads the Yoco SDK script if it's not already present.
 */
const loadYocoScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.YocoSDK) {
      resolve();
      return;
    }

    // Check if script is already in the document but not yet loaded
    const existingScript = document.querySelector('script[src*="yoco.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error("Failed to load Yoco SDK")));
      return;
    }

    const script = document.createElement('script');
    script.src = "https://js.yoco.com/sdk/v1/yoco.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Yoco SDK. Please check your internet connection or disable ad-blockers."));
    document.head.appendChild(script);
  });
};

export const initializeYocoPayment = async (amountInCents: number, description: string): Promise<YocoPaymentResult> => {
  // Ensure SDK is loaded before proceeding
  try {
    await loadYocoScript();
  } catch (err: any) {
    throw new Error(err.message);
  }

  return new Promise((resolve, reject) => {
    if (!window.YocoSDK) {
      reject(new Error("Yoco SDK failed to initialize."));
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
          const errorMessage = result.error.message || "Payment failed";
          reject(new Error(errorMessage));
        } else {
          resolve(result);
        }
      },
    });
  });
};