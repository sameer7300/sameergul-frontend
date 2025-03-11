import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QP3gxFWlKllCGeEWWU7bpk836N6LYS41bKWn8DGdDwWE1NKFhr4781lTu8k7KyyJWDdRQVJM7yMNolxIJqzYFi000kl55Kd95');

export const createPaymentSession = async (amount: number, orderId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const response = await fetch('/api/v1/create-payment-intent/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        amount,
        orderId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: await stripe.elements().create('card'),
        billing_details: {
          name: 'Customer',
        },
      },
    });

    return result;
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
};
