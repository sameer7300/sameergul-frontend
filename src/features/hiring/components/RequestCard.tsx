import React from 'react';
import { Link } from 'react-router-dom';
import { HiringRequest } from '../types';
import StatusBadge from './StatusBadge';
import PriceDisplay from './PriceDisplay';
import { formatDate, getPriorityColor } from '../utils/formatters';

interface RequestCardProps {
  request: HiringRequest;
  showActions?: boolean;
}

export default function RequestCard({ request, showActions = true }: RequestCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {request.ticket_number}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-2">
            <Link to={`/hiring/request/${request.id}`} className="hover:text-indigo-600">
              {request.title}
            </Link>
          </h3>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {request.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${getPriorityColor(request.priority)}
          `}>
            {request.priority.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(request.created_at)}
          </span>
        </div>
        
        {request.quoted_price && (
          <PriceDisplay price={request.quoted_price} size="lg" />
        )}
      </div>

      {showActions && (
        <div className="mt-4 flex justify-end">
          <Link
            to={`/hiring/request/${request.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
}
