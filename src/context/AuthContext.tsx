import { createContext, useState, ReactNode, useContext } from 'react';
import authApi from '../services/auth';
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY, AUTH_USER_KEY } from '../config';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface AuthResponse {
  access: string; // Adjusted from 'token' to match common JWT naming
  refresh: string;
  // 'user' might not be in the response; we'll fetch it separately if needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.login(email, password);
      if (response.user && response.token) {
        const userData: User = response.user;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
        if (response.refresh_token) {
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, response.refresh_token);
        }
        authApi.setAuthToken(response.token);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to login';
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout(); // No refreshToken passed
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  };

  const value = { user, isAuthenticated, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;