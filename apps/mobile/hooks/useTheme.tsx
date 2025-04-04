import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Config';

type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeContextProps {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

// Define colors for light theme
const lightTheme: ThemeColors = {
  background: Colors.light,
  card: Colors.white,
  text: Colors.dark,
  border: Colors.lightGray,
  primary: Colors.primary,
  secondary: Colors.secondary,
  accent: Colors.info,
  error: Colors.danger,
  success: Colors.secondary,
  warning: Colors.warning,
  info: Colors.info,
};

// Define colors for dark theme
const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f0f0f0',
  border: '#333333',
  primary: '#2196F3',
  secondary: '#4CAF50',
  accent: '#03A9F4',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#03A9F4',
};

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>((deviceTheme as Theme) || 'light');

  // Update theme when device theme changes
  useEffect(() => {
    if (deviceTheme) {
      setTheme(deviceTheme as Theme);
    }
  }, [deviceTheme]);

  // Get colors based on current theme
  const colors = theme === 'dark' ? darkTheme : lightTheme;

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
