import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../../services/adminApi';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import type { HiringRequest, RequestUpdateData } from '../../../services/adminApi';

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [notes, setNotes] = useState('');

  const { data: request, isLoading, error } = useQuery<HiringRequest>({
    queryKey: ['adminRequest', id],
    queryFn: async () => {
      try {
        const response = await adminApi.getRequestDetails(Number(id));
        return response.data;
      } catch (error) {
        console.error('Error fetching request:', error);
        throw new Error('Failed to load request details');
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RequestUpdateData) => {
      const response = await adminApi.updateHiringRequest(Number(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRequest', id] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to update request:', error);
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMutation.mutateAsync({ status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;

    try {
      await updateMutation.mutateAsync({
        quoted_price: Number(price),
        status: 'priced',
      });
      setPrice('');
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        admin_notes: notes,
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading request details</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Please try again later or contact support if the issue persists.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/requests')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Return to Requests List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Request Details - {request.ticket_number}
        </h1>
        <button
          onClick={() => navigate('/admin/requests')}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {request.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Created on {formatDate(request.created_at)}
              </p>
            </div>
            <span className={`
              px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'priced' ? 'bg-blue-100 text-blue-800' :
                request.status === 'paid' ? 'bg-green-100 text-green-800' :
                request.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'}
            `}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{request.service_type?.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {request.user?.first_name} {request.user?.last_name}
                <br />
                <span className="text-gray-500">{request.user?.email}</span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{request.description}</dd>
            </div>
            {request.requirements && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Requirements</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{request.requirements}</dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{request.priority}</dd>
            </div>
            {request.deadline && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.deadline)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Price Section */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
              {request.quoted_price ? (
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {formatCurrency(request.quoted_price)}
                </p>
              ) : (
                <form onSubmit={handlePriceSubmit} className="mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-48">
                      <label htmlFor="price" className="sr-only">Price</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!price || updateMutation.isPending}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {updateMutation.isPending ? 'Setting Price...' : 'Set Price'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Admin Notes */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Admin Notes</h4>
              {isEditing ? (
                <form onSubmit={handleNotesSubmit} className="mt-2">
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="mt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setNotes(request.admin_notes || '');
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {request.admin_notes || 'No notes yet.'}
                  </p>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setNotes(request.admin_notes || '');
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    {request.admin_notes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
