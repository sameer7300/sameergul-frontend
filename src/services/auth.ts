import axios from 'axios';
import {
  API_URL,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  REQUEST_TIMEOUT,
  ENDPOINTS,
} from '../config';
import { User } from '../contexts/AuthContext';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  access: string;
  refresh: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  avatar?: File;
}

const authApi = {
  register(data: RegisterData) {
    return api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data).then(res => res.data);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { token, refresh_token, user } = response.data;

    // Store auth data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (refresh_token) {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refresh_token);
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    // Set default auth header
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    return response.data;
  },

  logout(refreshToken?: string) {
    // Clear auth data
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    // Remove auth header
    delete api.defaults.headers.common.Authorization;

    return Promise.resolve();
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post<{ token: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh: refreshToken,
    });
    return response.data;
  },

  getProfile() {
    return api.get(ENDPOINTS.AUTH.PROFILE);
  },

  updateProfile(data: ProfileData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.patch(ENDPOINTS.AUTH.PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword(oldPassword: string, newPassword: string) {
    return api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // Add token to all subsequent requests
  setAuthToken(token: string | null) {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },
};

export default authApi;
