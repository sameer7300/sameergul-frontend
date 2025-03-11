const SAFEPAY_PUBLIC_KEY = 'sec_2d29dea2-f814-4a20-a971-ae0d454e9d07';
const SAFEPAY_BASE_URL = 'https://sandbox.api.getsafepay.com/v1';

export interface SafePayCheckoutOptions {
  amount: number;
  currency: string;
  orderId: string;
  cancelUrl: string;
  successUrl: string;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async (options: SafePayCheckoutOptions) => {
  const response = await fetch(`${SAFEPAY_BASE_URL}/checkout/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SAFEPAY_PUBLIC_KEY}`
    },
    body: JSON.stringify({
      amount: options.amount,
      currency: options.currency,
      order_id: options.orderId,
      cancel_url: options.cancelUrl,
      success_url: options.successUrl,
      metadata: options.metadata,
      environment: 'sandbox'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
};

export const verifyPayment = async (tracker: string) => {
  const response = await fetch(`${SAFEPAY_BASE_URL}/checkout/session/${tracker}/verify`, {
    headers: {
      'Authorization': `Bearer ${SAFEPAY_PUBLIC_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify payment');
  }

  return response.json();
};
