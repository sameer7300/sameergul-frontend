import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGetHiringRequestsQuery, useSetRequestPriceMutation, useProcessPaymentMutation } from '../../services/hiringApi';
import type { HiringRequest } from '../../services/hiringApi';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  quoted: 'bg-purple-100 text-purple-800',
  accepted: 'bg-indigo-100 text-indigo-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function RequestList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: requests, isLoading, error, refetch } = useGetHiringRequestsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true
    }
  );
  const [setPrice] = useSetRequestPriceMutation();
  const [processPayment] = useProcessPaymentMutation();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.is_staff || false;

  const handleSetPrice = async (requestId: number, price: number) => {
    try {
      await setPrice({ requestId, price }).unwrap();
    } catch (error) {
      console.error('Failed to set price:', error);
    }
  };

  const handlePayment = async (requestId: number) => {
    try {
      await processPayment(requestId).unwrap();
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  // Handle success message
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(
    location.state?.message ? {
      text: location.state.message,
      type: location.state.type || 'success'
    } : null
  );

  // Clear location state after reading message
  useEffect(() => {
    if (location.state?.message) {
      // Clear the location state immediately
      navigate(location.pathname, { 
        replace: true,
        state: {} // Clear state
      });
      
      // Set the message
      setMessage({
        text: location.state.message,
        type: location.state.type || 'success'
      });
      
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);

  // Refetch requests when component mounts
  useEffect(() => {
    console.log('Fetching requests...');
    refetch().then(result => {
      console.log('Fetch result:', result);
    }).catch(err => {
      console.error('Fetch error:', err);
    });
  }, [refetch]);

  const filteredRequests = requests?.filter(request => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesSearch = !searchQuery || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Error Loading Requests</h2>
          <p className="mt-4 text-lg text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {message && (
          <div className={`mb-4 rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        )}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Hiring Requests</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your hiring requests and their current status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/hiring/request/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              New Request
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="sm:w-64">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="quoted">Quoted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Request List */}
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Ticket
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRequests?.map((request) => (
                      <tr key={request.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {request.ticket_number}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Link to={`/hiring/request/${request.id}`} className="text-indigo-600 hover:text-indigo-900">
                            {request.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                            ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === 'priced' ? 'bg-blue-100 text-blue-800' : 
                              request.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.price ? `$${request.price}` : '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {isAdmin && request.status === 'pending' && (
                            <button
                              onClick={() => {
                                const price = prompt('Enter price for this request:');
                                if (price) {
                                  handleSetPrice(request.id, parseFloat(price));
                                }
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Set Price
                            </button>
                          )}
                          {!isAdmin && request.status === 'priced' && (
                            <button
                              onClick={() => handlePayment(request.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
