import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_TOKEN_KEY } from '../config';

export interface UserStats {
  total_requests: number;
  active_requests: number;
  completed_requests: number;
  total_spent: number;
}

export interface Notification {
  id: number;
  category: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface UserActivity {
  id: number;
  title: string;
  status: string;
  description: string;
  quoted_price: number;
  created_at: string;
}

export interface DashboardData {
  stats: UserStats;
  notifications: Notification[];
  recent_activities: UserActivity[];
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['UserStats', 'Notifications', 'Activities'],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => '/dashboard/user/dashboard/',
      providesTags: ['UserStats', 'Notifications', 'Activities'],
    }),

    markNotificationRead: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/dashboard/user/mark_notification_read/${notificationId}/`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),

    updateProfile: builder.mutation<
      void,
      {
        first_name?: string;
        last_name?: string;
        email?: string;
        avatar?: File;
      }
    >({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value);
          }
        });
        return {
          url: '/accounts/profile/',
          method: 'PATCH',
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useMarkNotificationReadMutation,
  useUpdateProfileMutation,
} = userApi;
