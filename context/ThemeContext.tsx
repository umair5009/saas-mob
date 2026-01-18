import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme color definitions
export const lightTheme = {
  // Background colors
  background: '#F9FAFB',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#F3F4F6',

  // Card colors
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Primary colors (blue)
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
  primaryDark: '#2563EB',

  // Secondary colors (purple - for parent theme)
  secondary: '#8B5CF6',
  secondaryLight: '#F3E8FF',
  secondaryDark: '#7C3AED',

  // Success colors
  success: '#22C55E',
  successLight: '#D1FAE5',
  successDark: '#059669',

  // Warning colors
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',

  // Error colors
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',

  // Status bar
  statusBar: 'dark' as const,

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabBarActive: '#3B82F6',
  tabBarInactive: '#6B7280',

  // Input colors
  inputBackground: '#F9FAFB',
  inputBorder: '#E5E7EB',
  inputText: '#1F2937',
  inputPlaceholder: '#9CA3AF',

  // Shadow
  shadowColor: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme = {
  // Background colors
  background: '#111827',
  backgroundSecondary: '#1F2937',
  backgroundTertiary: '#374151',

  // Card colors
  card: '#1F2937',
  cardElevated: '#374151',

  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#1F2937',

  // Border colors
  border: '#374151',
  borderLight: '#4B5563',

  // Primary colors (blue)
  primary: '#60A5FA',
  primaryLight: '#1E3A5F',
  primaryDark: '#3B82F6',

  // Secondary colors (purple - for parent theme)
  secondary: '#A78BFA',
  secondaryLight: '#2D2150',
  secondaryDark: '#8B5CF6',

  // Success colors
  success: '#34D399',
  successLight: '#064E3B',
  successDark: '#10B981',

  // Warning colors
  warning: '#FBBF24',
  warningLight: '#78350F',
  warningDark: '#F59E0B',

  // Error colors
  error: '#F87171',
  errorLight: '#7F1D1D',
  errorDark: '#EF4444',

  // Status bar
  statusBar: 'light' as const,

  // Tab bar
  tabBar: '#1F2937',
  tabBarBorder: '#374151',
  tabBarActive: '#60A5FA',
  tabBarInactive: '#9CA3AF',

  // Input colors
  inputBackground: '#374151',
  inputBorder: '#4B5563',
  inputText: '#F9FAFB',
  inputPlaceholder: '#9CA3AF',

  // Shadow
  shadowColor: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@school_app_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine if dark mode should be active
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  // Get current theme object
  const theme = isDark ? darkTheme : lightTheme;

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to create theme-aware styles
export function useThemedStyles<T>(styleFactory: (theme: Theme, isDark: boolean) => T): T {
  const { theme, isDark } = useTheme();
  return styleFactory(theme, isDark);
}
