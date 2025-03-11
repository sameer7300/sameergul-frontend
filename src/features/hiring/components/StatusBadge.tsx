import React from 'react';
import { getStatusColor, formatStatus } from '../utils/formatters';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);
  
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorClasses} ${className}
      `}
    >
      {formatStatus(status)}
    </span>
  );
}
