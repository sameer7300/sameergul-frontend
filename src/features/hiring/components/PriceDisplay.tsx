import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({ 
  price, 
  size = 'md',
  className = '' 
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formatCurrency(price)}
    </span>
  );
}
