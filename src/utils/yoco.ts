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
 * Ensures the Yoco SDK is available.
 */
const ensureYocoLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 1. If already defined, we are good
    if (window.YocoSDK) {
      resolve();
      return;
    }

    // 2. Look for existing script tag
    let script = document.querySelector('script[src*="yoco.js"]') as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.src = "https://js.yoco.com/sdk/v1/yoco.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Set up listeners
    script.onload = () => {
      if (window.YocoSDK) resolve();
      else reject(new Error("Yoco SDK script loaded but object not found."));
    };
    
    script.onerror = () => reject(new Error("Failed to load Yoco SDK. Check your connection."));

    // 4. Safety timeout: If it takes more than 7 seconds, stop waiting
    setTimeout(() => {
      if (window.YocoSDK) resolve();
      else reject(new Error("Yoco SDK load timed out. Please refresh the page."));
    }, 7000);
  });
};

export const initializeYocoPayment = async (amountInCents: number, description: string): Promise<YocoPaymentResult> => {
  // Wait for SDK
  await ensureYocoLoaded();

  return new Promise((resolve, reject) => {
    try {
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
            reject(new Error(result.error.message || "Payment failed"));
          } else {
            resolve(result);
          }
        },
      });
      
      // If the popup is closed without a callback (some versions of SDK)
      // we might need to handle that, but usually Yoco calls the callback with an error.
    } catch (err: any) {
      reject(new Error("Could not initialize Yoco popup: " + err.message));
    }
  });
};