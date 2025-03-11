import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useGetHiringRequestQuery, updateHiringRequest } from '../../../services/hiringApi';
import StatusBadge from '../components/StatusBadge';
import PriceDisplay from '../components/PriceDisplay';
import { formatDateTime, getPriorityColor } from '../utils/formatters';
import { toast } from 'react-toastify';
import StripePaymentForm from '../../../components/StripePaymentForm';

const stripePromise = loadStripe('pk_test_51QP3gxFWlKllCGeEWWU7bpk836N6LYS41bKWn8DGdDwWE1NKFhr4781lTu8k7KyyJWDdRQVJM7yMNolxIJqzYFi000kl55Kd95');

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  
  const {
    data: request,
    isLoading,
    error,
    refetch
  } = useGetHiringRequestQuery(parseInt(id || '0'));

  // Check for payment success query param on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      handlePaymentSuccess();
      // Clear the URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handlePayment = () => {
    if (!request || !request.quoted_price) {
      toast.error('No price has been quoted for this request');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!id) {
        throw new Error('Request ID is required');
      }
      console.log('Payment success, updating request status...');
      setIsProcessing(true);
      await updateHiringRequest(parseInt(id), { status: 'paid' });
      console.log('Request status updated to paid');
      toast.success('Payment successful! Your request is now being processed.');
      // Navigate to success page with correct path
      navigate(`/hiring/payment-success`, { 
        state: { 
          requestId: id,
          amount: request?.quoted_price 
        },
        replace: true  // This prevents back navigation to payment form
      });
      refetch();
    } catch (error: any) {
      console.error('Failed to update request status:', error);
      toast.error('Payment recorded but status update failed. Please contact support.');
    } finally {
      setIsProcessing(false);
      setShowPaymentForm(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Navigate to failure page with correct path
    navigate(`/hiring/payment-failed`, {
      state: {
        requestId: id,
        error: error
      },
      replace: true  // This prevents back navigation to payment form
    });
    setShowPaymentForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Request Not Found
            </h2>
            <p className="mt-2 text-gray-600">
              We couldn't find the request you're looking for.
            </p>
            <button
              onClick={() => navigate('/hiring/requests')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure id is not undefined before using it
  if (!id) {
    return <div>Invalid request ID</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/hiring/requests')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Requests
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {request.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ticket: {request.ticket_number}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            {/* Service Info */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Service Information
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.service?.name || 'Unknown Service'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {request.price ? (
                      <PriceDisplay price={request.price} size="lg" />
                    ) : (
                      'Pending'
                    )}
                  </dd>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Request Details
              </h3>
              <div className="mt-4 space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {request.description}
                  </dd>
                </div>
                
                {request.requirements && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Requirements</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {request.requirements}
                    </dd>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                    <dd className="mt-1">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${getPriorityColor(request.priority)}
                        `}
                      >
                        {request.priority.toUpperCase()}
                      </span>
                    </dd>
                  </div>
                  
                  {request.deadline && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDateTime(request.deadline)}
                      </dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDateTime(request.created_at)}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {request.status === 'priced' && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-end">
                    <div className="text-sm text-gray-500 flex items-center">
                      Amount to pay: <PriceDisplay price={request.quoted_price || 0} size="lg" className="ml-2" />
                    </div>
                  </div>
                  
                  {showPaymentForm ? (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        amount={Math.round((request.quoted_price || 0) * 100)}
                        requestId={parseInt(id)}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Elements>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handlePayment}
                        className={`
                          inline-flex items-center px-4 py-2 border border-transparent 
                          text-sm font-medium rounded-md shadow-sm text-white 
                          ${isProcessing 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                          }
                        `}
                      >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
