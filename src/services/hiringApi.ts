import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { AUTH_TOKEN_KEY } from '../config';
import { CreateHiringRequest, HiringRequest } from '../features/hiring/types';
import { API_V1_URL } from '../config';

interface ServiceType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  image?: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface RequestMessage {
  id: number;
  request: number;
  sender: number;
  sender_name: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

interface RequestAttachment {
  id: number;
  request: number;
  file: string;
  description: string;
  created_at: string;
}

const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || null;
};

// Base API URL from environment variable or default
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const hiringApi = createApi({
  reducerPath: 'hiringApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_V1_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ServiceTypes', 'HiringRequests', 'Messages', 'Attachments', 'Requests'],
  endpoints: (builder) => ({
    getServiceTypes: builder.query<ServiceType[], void>({
      query: () => 'services/',
      providesTags: ['ServiceTypes'],
    }),

    getHiringRequests: builder.query<HiringRequest[], { email?: string } | void>({
      query: (params) => ({
        url: '/hiring/requests/',
        params: params || undefined,
      }),
      providesTags: ['Requests'],
    }),

    getHiringRequest: builder.query<HiringRequest, number>({
      query: (id) => ({
        url: `requests/${id}/`,
        params: {
          email: localStorage.getItem('userEmail')
        }
      }),
      providesTags: (result, error, id) => [{ type: 'HiringRequests', id }],
    }),

    createHiringRequest: builder.mutation<HiringRequest, CreateHiringRequest>({
      query: (data) => ({
        url: '/requests/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HiringRequests'],
    }),

    updateHiringRequest: builder.mutation<HiringRequest, Partial<HiringRequest> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `requests/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'HiringRequests', id }],
    }),

    deleteHiringRequest: builder.mutation<void, number>({
      query: (id) => ({
        url: `requests/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HiringRequests'],
    }),

    getRequestMessages: builder.query<RequestMessage[], number>({
      query: (requestId) => `requests/${requestId}/messages/`,
      providesTags: (result, error, requestId) => [{ type: 'Messages', id: requestId }],
    }),

    addRequestMessage: builder.mutation<RequestMessage, { requestId: number; message: string }>({
      query: ({ requestId, message }) => ({
        url: `requests/${requestId}/messages/`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { requestId }) => [{ type: 'Messages', id: requestId }],
    }),

    uploadAttachment: builder.mutation<RequestAttachment, { requestId: number; file: File; description?: string }>({
      query: ({ requestId, file, description }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
          formData.append('description', description);
        }
        return {
          url: `requests/${requestId}/attachments/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { requestId }) => [{ type: 'Attachments', id: requestId }],
    }),

    setRequestPrice: builder.mutation<HiringRequest, { requestId: number; price: number }>({
      query: ({ requestId, price }) => ({
        url: `/hiring/requests/${requestId}/set_price/`,
        method: 'POST',
        body: { price },
      }),
      invalidatesTags: ['Requests'],
    }),

    processPayment: builder.mutation<HiringRequest, number>({
      query: (requestId) => ({
        url: `/hiring/requests/${requestId}/process_payment/`,
        method: 'POST',
      }),
      invalidatesTags: ['Requests'],
    }),
  }),
});

export const {
  useGetServiceTypesQuery,
  useGetHiringRequestsQuery,
  useGetHiringRequestQuery,
  useCreateHiringRequestMutation,
  useUpdateHiringRequestMutation,
  useDeleteHiringRequestMutation,
  useGetRequestMessagesQuery,
  useAddRequestMessageMutation,
  useUploadAttachmentMutation,
  useSetRequestPriceMutation,
  useProcessPaymentMutation,
} = hiringApi;

export type { CreateHiringRequest, HiringRequest };

// Payment endpoints
export const createPaymentTransaction = async (hiringRequestId: number, amount: number) => {
  try {
    // First get the SafePay payment method ID
    const methodResponse = await fetch(`${baseUrl}/payments/methods/`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    const methods = await methodResponse.json();
    const safepayMethod = methods.find((m: any) => m.payment_type === 'safepay');
    
    if (!safepayMethod) {
      throw new Error('SafePay payment method not found');
    }

    const response = await fetch(`${baseUrl}/payments/transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        hiring_request: hiringRequestId,
        amount: amount,
        payment_method: safepayMethod.id,
        currency: 'PKR'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.error || 'Failed to create payment transaction');
    }

    return response.json();
  } catch (error: any) {
    console.error('Payment creation error:', error);
    throw new Error(error.message || 'Failed to create payment transaction');
  }
};

export const updateHiringRequest = async (id: number, data: any) => {
  const response = await fetch(`${baseUrl}/hiring/requests/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update hiring request');
  }

  return response.json();
};
