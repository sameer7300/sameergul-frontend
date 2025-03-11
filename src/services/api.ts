import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/portfolio/projects/',
  '/portfolio/skills/',
  '/portfolio/timeline/',
  '/portfolio/contact/',
  '/accounts/login/',
  '/accounts/register/',
  '/accounts/forgot-password/',
  '/accounts/reset-password/',
];

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token only for authenticated endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
    config.url?.startsWith(endpoint)
  );

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Handle unauthorized error by redirecting to login
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Project types
export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  thumbnail: string;
  technologies: any; 
  status: string;
  is_featured: boolean;
  order: number;
  github_url?: string;
  live_url?: string;
}

export interface ProjectsResponse {
  results?: Project[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Project API endpoints
export const projectsApi = {
  // Get all projects with optional filtering
  getProjects: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<Project[] | ProjectsResponse>('/portfolio/projects/', { params });
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return { results: response.data };
    }
    return response.data;
  },

  // Get single project by slug
  getProject: async (slug: string) => {
    const response = await api.get<Project>(`/portfolio/projects/${slug}/`);
    return response.data;
  },

  // Create new project (admin only)
  createProject: async (data: Partial<Project>) => {
    const response = await api.post<Project>('/portfolio/projects/', data);
    return response.data;
  },

  // Update project (admin only)
  updateProject: async (id: number, data: Partial<Project>) => {
    const response = await api.put<Project>(`/portfolio/projects/${id}/`, data);
    return response.data;
  },

  // Delete project (admin only)
  deleteProject: async (id: number) => {
    await api.delete(`/portfolio/projects/${id}/`);
  },
};

// Contact API endpoints
export const contactApi = {
  // Create new contact message
  createContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post<{ id: number; status: string }>('/portfolio/contacts/', data);
    return response.data;
  },
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/accounts/login/', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string) => {
    const response = await api.post('/accounts/register/', { email, password });
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/accounts/forgot-password/', { email });
    return response.data;
  },
  
  resetPassword: async (email: string, token: string, newPassword: string) => {
    const response = await api.post('/accounts/reset-password/', {
      email,
      token,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default api;
