"use client";

/**
 * Yoco Payment Utility
 * Handles the integration with the Yoco SDK for South African payments.
 */

declare const YocoSDK: any;

// Placeholder Test Key - User should replace this in Supabase secrets or env
const YOCO_PUBLIC_KEY = "pk_test_ed3c54a69u4p9p17z4a7";

export interface YocoPaymentResult {
  id: string;
  amountInCents: number;
  currency: string;
}

export const initializeYocoPayment = (amountInCents: number, description: string): Promise<YocoPaymentResult> => {
  return new Promise((resolve, reject) => {
    const yoco = new YocoSDK({
      publicKey: YOCO_PUBLIC_KEY,
    });

    yoco.showPopup({
      amountInCents: amountInCents,
      currency: 'ZAR',
      name: 'GMB Creation Co.',
      description: description,
      callback: (result: any) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result);
        }
      },
    });
  });
};