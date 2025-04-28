// Change this to your actual API URL when deploying
export const API_BASE_URL = 'https://b394-197-232-0-80.ngrok-free.app/api';

// For production, you might use environment variables:
// export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-domain.com';

// Theme colors
export const Colors = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  info: '#03A9F4',
  light: '#f5f5f5',
  dark: '#333',
  gray: '#666',
  lightGray: '#e0e0e0',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// App-wide constants
export const Constants = {
  itemsPerPage: 10,
  debounceTime: 500, // ms
  tokenKey: 'pr-contacts-token',
  userInfoKey: 'pr-contacts-user-info',
};
