import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { StatusBadge } from '../../hiring/components';
import { formatCurrency } from '../../../utils/formatters';
import type { HiringRequest } from '../../../features/hiring/types';

interface RecentRequestsProps {
  requests: HiringRequest[];
  isLoading?: boolean;
}

const formatUserName = (request: HiringRequest) => {
  if (!request.user) return 'Anonymous';
  const firstName = request.user.first_name || '';
  const lastName = request.user.last_name || '';
  return [firstName, lastName].filter(Boolean).join(' ') || request.user.email || 'Anonymous';
};

export default function RecentRequests({ requests, isLoading = false }: RecentRequestsProps) {
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md animate-pulse">
        <div className="px-4 py-5 sm:px-6">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <li key={i} className="px-4 py-4 sm:px-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Requests
          </h3>
        </div>
        <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
          No requests found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Requests
        </h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {requests.map((request) => (
          <li key={request.id}>
            <Link
              to={`/admin/requests/${request.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {request.ticket_number}
                    </span>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {request.service_type?.name || 'Unknown Service'}
                    </p>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-sm text-gray-500">
                      {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {formatUserName(request)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {request.quoted_price
                        ? formatCurrency(request.quoted_price)
                        : 'Not quoted'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
