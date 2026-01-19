import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configure base URL based on environment
// For physical devices, we need the LAN IP address
const getBaseUrl = () => {
  if (__DEV__) {
    // Automatically detected LAN IP
    return 'http://192.168.100.127:5000/api';
  }
  return 'https://api.yourschool.com/api'; // Production URL
};

export const API_URL = getBaseUrl();

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface User {
  _id: string;
  id: string; // alias for _id for compatibility
  email: string;
  name: string;
  // Enhanced fields for UI
  firstName?: string;
  photo?: string;
  section?: string;

  role: 'student' | 'parent' | 'teacher' | 'staff';
  class?: string | any;
  rollNo?: string;
  phone?: string;
  children?: any[];
  avatar?: string | null;
  branch?: any;
  dashboard?: {
    upcomingExams: any[];
    gpa: string;
    feeDue: number;
    attendance: {
      percentage: number;
      present: number;
      total: number;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (token && storedUser) {
        // Set default header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Restore user session
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserRole(parsedUser.role);

        // Verify token validity with backend
        try {
          const response = await api.get('/mobile/auth/me');
          if (response.data.success) {
            const userData = response.data.data.user;
            // Map _id to id for compatibility
            userData.id = userData._id;

            // Merge with profile data if available
            if (response.data.data.profile) {
              Object.assign(userData, response.data.data.profile);
            }
            // Add children for parents
            if (response.data.data.children) {
              userData.children = response.data.data.children;
            }
            // Add dashboard data
            if (response.data.data.dashboard) {
              userData.dashboard = response.data.data.dashboard;
            }

            setUser(userData);
            setUserRole(userData.role);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          // Token invalid or expired
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get device info for registration
      const deviceId = Device.osBuildId || 'unknown-device';
      const deviceName = Device.modelName || 'Unknown Device';

      // Get push token if permissions allow (simplified)
      let deviceToken = null;
      // Note: Actual permission request logic should be in a separate hook/component

      const response = await api.post('/mobile/auth/login', {
        email,
        password,
        role, // Send role for verification if needed server-side or just logging
        deviceId,
        deviceName,
        platform: Platform.OS,
        deviceToken
      });

      if (response.data.success) {
        const { token, data } = response.data;
        const userData = data.user;

        // Map _id to id for compatibility
        userData.id = userData._id;

        // Merge with profile data if available
        if (data.profile) {
          Object.assign(userData, data.profile);
        }
        // Add children for parents
        if (data.children) {
          userData.children = data.children;
        }
        // Add dashboard data
        if (data.dashboard) {
          userData.dashboard = data.dashboard;
        }

        // Save session
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Set axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
        setUserRole(userData.role);

        return { success: true };
      }

      return { success: false, error: response.data.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Connection error. Please try again.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      // Notify backend if possible
      try {
        const deviceId = Device.osBuildId || 'unknown-device';
        await api.post('/mobile/auth/logout', { deviceId });
      } catch (e) {
        // Ignore error on logout api call
        console.log('Logout API call failed, continuing local logout');
      }

      // Clear local storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Reset state
      setUser(null);
      setUserRole(null);

      // Clear header
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole,
        isLoading,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export dummy users for reference only - can be removed later
export const DUMMY_USERS = { students: [], parents: [] };
