import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AUTH_TOKEN_KEY, API_V1_URL } from '../config';

interface StripePaymentFormProps {
  amount: number;
  requestId: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, requestId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Payment submission started');

    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      onError('Payment system not ready');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        throw new Error('Please log in to make a payment');
      }

      console.log('Creating payment intent...', { amount, requestId });
      const response = await fetch(`${API_V1_URL}/create-payment-intent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount,
          request_id: requestId
        }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || 'Failed to create payment intent');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${responseText || 'No error details'}`);
        }
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      console.log('Payment intent created successfully');
      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      console.log('Confirming card payment...');
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer',
          },
        },
      });

      if (paymentError) {
        console.error('Payment error:', paymentError);
        throw new Error(paymentError.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded');
        onSuccess();
      } else {
        console.error('Payment status:', paymentIntent.status);
        throw new Error('Payment failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMsg = err.message || 'An error occurred during payment';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-4 border rounded-md shadow-sm"
        />
      </div>
      {errorMessage && (
        <div className="mb-4 text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`
          w-full px-4 py-2 text-white rounded-md
          ${isProcessing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
          }
        `}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripePaymentForm;
