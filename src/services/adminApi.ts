import api from './api';
import { User } from '../features/hiring/types';

export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  total_projects: number;
  total_revenue: number;
  recent_activities: any[];
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
}

export interface HiringRequest {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  requirements?: string;
  status: string;
  priority: string;
  quoted_price?: number;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  service_type: ServiceType;
  user: User;
}

export interface RequestUpdateData {
  status?: string;
  quoted_price?: number;
  admin_notes?: string;
}

export interface AnalyticsData {
  date: string;
  requests: number;
  revenue: number;
  avg_response_time: number;
}

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: 'day' | 'week' | 'month';
}

interface ApiResponse<T> {
  data: T;
}

export const adminApi = {
  // Get dashboard statistics
  getDashboardStats() {
    return api.get<AdminDashboardStats>('/dashboard/stats/');
  },

  // Get all users
  getUsers: async (): Promise<{ data: User[] }> => {
    const response = await fetch('/api/v1/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return { data: data.map((user: any) => ({
      ...user,
      is_staff: Boolean(user.is_staff)
    }))};
  },

  // Get user details
  getUserDetails(userId: number) {
    return api.get<User>(`/auth/users/${userId}/`);
  },

  // Update user
  updateUser(userId: number, data: Partial<User>) {
    return api.patch<User>(`/auth/users/${userId}/`, data);
  },

  // Get all hiring requests with filters
  getHiringRequests(params?: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    return api.get<{ results: HiringRequest[]; count: number }>('/hiring/requests/', { params });
  },

  // Get single hiring request
  getRequestDetails(id: number) {
    return api.get<HiringRequest>(`/hiring/requests/${id}/`);
  },

  // Update hiring request
  updateHiringRequest(id: number, data: RequestUpdateData) {
    return api.patch<HiringRequest>(`/hiring/requests/${id}/`, data);
  },

  // Get analytics data
  getAnalytics(params?: AnalyticsParams) {
    return api.get<AnalyticsData[]>('/dashboard/analytics/', { params });
  },
};
