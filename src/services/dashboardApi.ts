import api from './api';

export interface DashboardStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalSpent: number;
  lastActivity?: string;
}

export interface DashboardNotification {
  id: number;
  category: 'request' | 'payment' | 'message' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardDocument {
  id: number;
  title: string;
  documentType: 'receipt' | 'invoice' | 'contract' | 'attachment' | 'other';
  file: string;
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  stats: {
    total_requests: number;
    active_requests: number;
    completed_requests: number;
    total_spent: number;
    last_activity?: string;
  };
  unread_notifications: Array<{
    id: number;
    category: 'request' | 'payment' | 'message' | 'system';
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
  }>;
  recent_requests: Array<any>;
  recent_transactions: Array<any>;
}

const dashboardApi = {
  // Get dashboard overview and stats
  getStats: async (): Promise<DashboardOverview> => {
    try {
      const response = await api.get('/user-dashboard/overview/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        stats: {
          total_requests: 0,
          active_requests: 0,
          completed_requests: 0,
          total_spent: 0
        },
        unread_notifications: [],
        recent_requests: [],
        recent_transactions: []
      };
    }
  },

  // Get notifications with pagination and filters
  getNotifications: async (params?: { 
    page?: number; 
    limit?: number;
    is_read?: boolean;
  }) => {
    const response = await api.get('/user-dashboard/notifications/', { params });
    return response.data;
  },

  // Mark single notification as read
  markNotificationAsRead: async (notificationId: number): Promise<void> => {
    await api.post(`/user-dashboard/notifications/${notificationId}/mark_read/`);
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (): Promise<void> => {
    await api.post('/user-dashboard/notifications/mark_all_read/');
  },

  // Search dashboard items
  search: async (query: string) => {
    const response = await api.get('/user-dashboard/search/', { params: { q: query } });
    return response.data;
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await api.get('/user-dashboard/preferences/');
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (data: {
    defaultView?: string;
    notificationEmail?: boolean;
    notificationWeb?: boolean;
    itemsPerPage?: number;
  }) => {
    const response = await api.patch('/user-dashboard/preferences/', data);
    return response.data;
  },
};

export default dashboardApi;
