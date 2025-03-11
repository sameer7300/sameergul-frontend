import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { AUTH_TOKEN_KEY } from '../config';
import { HiringRequest } from '../features/hiring/types';

export interface AdminDashboardStats {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  total_revenue: number;
  recent_requests: HiringRequest[];
  requests_by_status: {
    status: string;
    count: number;
  }[];
  requests_by_service: {
    service: string;
    count: number;
  }[];
}

export interface RequestUpdateData {
  status?: string;
  quoted_price?: number;
  admin_notes?: string;
}

export interface AnalyticsData {
  date: string;
  total_requests: number;
  completed_requests: number;
  revenue: number;
  response_time: number;
}

export interface DailyStats {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  total_revenue: number;
}

export interface SystemConfig {
  maintenance_mode: boolean;
  system_message?: string;
}

export interface UserActivity {
  total_requests: number;
  completed_requests: number;
  total_spent: number;
  recent_activity: {
    date: string;
    action: string;
    details: string;
  }[];
}

// Base API URL from environment variable or default
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminStats', 'Requests', 'Analytics', 'Config'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => '/dashboard/admin/admin_stats/',
      providesTags: ['AdminStats'],
    }),

    getHiringRequests: builder.query<
      { results: HiringRequest[]; count: number },
      void | { status?: string; service_type?: number; search?: string; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/dashboard/admin/requests/',
        params: params || undefined,
      }),
      transformResponse: (response: { results: HiringRequest[]; count: number }) => ({
        results: response.results.map(request => ({
          ...request,
          service: {
            ...request.service,
            id: request.service.id as unknown as number
          }
        })),
        count: response.count
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Requests' as const,
                id,
              })),
              'Requests',
            ]
          : ['Requests'],
    }),

    getRequestDetails: builder.query<HiringRequest, number>({
      query: (requestId) => `/dashboard/admin/${requestId}/request_detail/`,
      providesTags: (result, error, id) => [{ type: 'Requests', id }],
    }),

    updateHiringRequest: builder.mutation<
      HiringRequest,
      { requestId: number; data: RequestUpdateData }
    >({
      query: ({ requestId, data }) => ({
        url: `/dashboard/admin/${requestId}/update_request/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: 'Requests', id: requestId },
        'AdminStats',
      ],
    }),

    setRequestPrice: builder.mutation<
      HiringRequest,
      { requestId: number; price: number }
    >({
      query: ({ requestId, price }) => ({
        url: `/dashboard/admin/${requestId}/set_price/`,
        method: 'POST',
        body: { price },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: 'Requests', id: requestId },
        'AdminStats',
      ],
    }),

    getAnalytics: builder.query<
      AnalyticsData[],
      { start_date?: string; end_date?: string; group_by?: 'day' | 'week' | 'month' }
    >({
      query: (params) => ({
        url: '/dashboard/analytics/',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    getDailyStats: builder.query<DailyStats, string>({
      query: (date) => `/dashboard/stats/daily/${date}/`,
      providesTags: ['AdminStats'],
    }),

    getUserActivity: builder.query<UserActivity, number>({
      query: (userId) => `/dashboard/activities/${userId}/`,
    }),

    getSystemConfig: builder.query<SystemConfig, void>({
      query: () => '/dashboard/config/',
      providesTags: ['Config'],
    }),

    updateSystemConfig: builder.mutation<
      SystemConfig,
      Partial<SystemConfig>
    >({
      query: (data) => ({
        url: '/dashboard/config/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Config'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetHiringRequestsQuery,
  useGetRequestDetailsQuery,
  useUpdateHiringRequestMutation,
  useSetRequestPriceMutation,
  useGetAnalyticsQuery,
  useGetDailyStatsQuery,
  useGetUserActivityQuery,
  useGetSystemConfigQuery,
  useUpdateSystemConfigMutation,
} = adminApi;
