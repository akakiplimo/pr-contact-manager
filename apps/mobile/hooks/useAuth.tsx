import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';
import {
  API_ROUTES,
  IAuthResponse,
  IUser,
  Role,
} from '../../../packages/shared/src';
import { API_BASE_URL } from '../constants/Config';

// Auth context types
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  hasRole: (role: Role | Role[]) => boolean;
};

// Storage keys
const TOKEN_KEY = 'pr-contacts-token';
const USER_INFO_KEY = 'pr-contacts-user';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  console.log('usr', user);

  // Check if user is authenticated on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check auth status
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Get user info from secure store
      const userJson = await SecureStore.getItemAsync(USER_INFO_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Fetch user profile if stored user not found
        try {
          const response = await axios.get(
            `${API_BASE_URL}${API_ROUTES.AUTH.PROFILE}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setUser(response.data);
          await SecureStore.setItemAsync(
            USER_INFO_KEY,
            JSON.stringify(response.data)
          );
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be invalid or expired
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_INFO_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log(
        'Attempting to connect to:',
        `${API_BASE_URL}${API_ROUTES.AUTH.LOGIN}`
      );
      const response = await axios.post(
        `${API_BASE_URL}${API_ROUTES.AUTH.LOGIN}`,
        { email, password },
        {
          timeout: 10000, // Set timeout to see if request is hanging
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Response:', response);

      // Check if access_token exists
      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.access_token);
      // Fetch user profile with the token since it's not in the response
      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}${API_ROUTES.USER.BASE}/${response.data.email}`
          // {
          //   headers: { Authorization: `Bearer ${response.data.access_token}` },
          // }
        );

        console.log('User profile response:', userResponse);

        // Store user info
        const userData = userResponse.data;
        await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(userData));
        setUser(userData);
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
      }

      setUser(response.data.user);
      setIsAuthenticated(true);

      // Navigate to app home
      router.replace('/(app)');
    } catch (error) {
      console.error('Login error:', error);
      // More detailed error logging
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with non-2xx status
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          // Request was made but no response
          console.error('No response received:', error.request);
        }
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post<IAuthResponse>(
        `${API_BASE_URL}${API_ROUTES.AUTH.REGISTER}`,
        { name, email, password }
      );

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.access_token);
      await SecureStore.setItemAsync(
        USER_INFO_KEY,
        JSON.stringify(response.data.user)
      );

      setUser(response.data.user);
      setIsAuthenticated(true);

      // Navigate to app home
      router.replace('/(app)');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_INFO_KEY);

      setIsAuthenticated(false);
      setUser(null);

      // Navigate to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user has specific role
  const hasRole = (role: Role | Role[]) => {
    if (!user || !user.roles) return false;

    if (Array.isArray(role)) {
      return role.some((r) => user.roles.includes(r));
    }

    return user.roles.includes(role);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    checkAuthStatus,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
