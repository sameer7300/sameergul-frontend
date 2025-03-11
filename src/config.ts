// API Configuration
export const API_BASE_URL = 'http://localhost:8000';
export const API_V1_URL = `${API_BASE_URL}/api/v1`;
export const API_URL = import.meta.env.VITE_API_URL || API_V1_URL;
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Local Storage Keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const AUTH_USER_KEY = 'auth_user';

// Payment
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QP3gxFWlKllCGeEWWU7bpk836N6LYS41bKWn8DGdDwWE1NKFhr4781lTu8k7KyyJWDdRQVJM7yMNolxIJqzYFi000kl55Kd95';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/accounts/login/',
    REGISTER: '/accounts/register/',
    LOGOUT: '/accounts/logout/',
    REFRESH: '/accounts/token/refresh/',
    REFRESH_TOKEN: '/accounts/token/refresh/',
    PROFILE: '/accounts/profile/',
    CHANGE_PASSWORD: '/accounts/change-password/',
  },
  HIRING: {
    SERVICES: '/hiring/services/',
    REQUESTS: '/hiring/requests/',
  },
};

// Route Configuration
export const PUBLIC_ROUTES = ['/', '/login', '/register', '/about', '/projects', '/contact'];
export const AUTH_ROUTES = ['/dashboard', '/profile', '/settings'];
export const ADMIN_ROUTES = ['/admin'];

// Validation Configuration
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Feature Flags
export const ENABLE_SOCIAL_AUTH = false;
export const ENABLE_PASSWORD_RESET = true;
export const ENABLE_EMAIL_VERIFICATION = true;
