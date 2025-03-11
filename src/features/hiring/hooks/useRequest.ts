import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useCreateHiringRequestMutation,
  useGetHiringRequestsQuery,
} from '../../../services/hiringApi';
import type { CreateHiringRequest } from '../types';

export const useRequest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [createRequest] = useCreateHiringRequestMutation();
  const { refetch } = useGetHiringRequestsQuery({ email: user?.email });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRequest = async (data: CreateHiringRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await createRequest(data).unwrap();
      console.log('Created request:', response);
      
      // Store email for anonymous requests
      if (!isAuthenticated && data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      
      // Navigate to the requests list
      navigate('/hiring/requests', { 
        replace: true,
        state: { 
          message: 'Request created successfully!',
          type: 'success'
        }
      });

      // Refetch the requests list
      await refetch();
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to create request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRequest,
    isSubmitting,
    error,
    setError,
  };
};
