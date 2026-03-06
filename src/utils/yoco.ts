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
 * Ensures the Yoco SDK is available by polling window.YocoSDK
 */
const ensureYocoLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 1. Check if it's already there
    if (window.YocoSDK) {
      resolve();
      return;
    }

    // 2. If not, ensure the script tag exists
    const existingScript = document.querySelector('script[src*="yoco.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://js.yoco.com/sdk/v1/yoco.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Poll for the object (check every 100ms)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds total
    
    const interval = setInterval(() => {
      attempts++;
      if (window.YocoSDK) {
        clearInterval(interval);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error("Yoco SDK failed to load after 5 seconds. Please check your connection or disable ad-blockers."));
      }
    }, 100);
  });
};

export const initializeYocoPayment = async (amountInCents: number, description: string): Promise<YocoPaymentResult> => {
  try {
    // Wait for SDK to be ready
    await ensureYocoLoaded();

    return new Promise((resolve, reject) => {
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
    });
  } catch (err: any) {
    throw new Error(err.message || "Could not initialize payment");
  }
};