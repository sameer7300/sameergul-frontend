import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useGetHiringRequestsQuery } from '../../../services/hiringApi';
import RequestCard from '../components/RequestCard';
import type { HiringRequest } from '../types';

export default function RequestList() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Get email from localStorage for anonymous users
  useEffect(() => {
    if (!isAuthenticated) {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, [isAuthenticated]);

  // Handle success/error messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage({
        text: location.state.message,
        type: location.state.type || 'success'
      });
      setShowMessage(true);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const {
    data: requests = [],
    isLoading,
    error,
    refetch
  } = useGetHiringRequestsQuery(
    isAuthenticated ? undefined : { email: userEmail },
    {
      skip: !isAuthenticated && !userEmail,
    }
  );

  // Sort requests by creation date (newest first)
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (!isAuthenticated && !userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              View Your Requests
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Enter your email to view your requests:
              </p>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Requests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Error Loading Requests
            </h2>
            <p className="mt-2 text-gray-600">
              We couldn't load your requests. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Requests
            </h2>
            <p className="mt-1 text-gray-600">
              {isAuthenticated ? user?.email : userEmail}
            </p>
          </div>
          <Link
            to="/hiring/services"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Request
          </Link>
        </div>

        {/* Success/Error Message */}
        {showMessage && message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Requests List */}
        {sortedRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-2 text-gray-500">
              Get started by creating a new request
            </p>
            <Link
              to="/hiring/services"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Request
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedRequests.map((request: HiringRequest) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
