// Application constants
export const APP_NAME = 'grAIn';
export const APP_VERSION = '0.1.0';

// Colors
export const COLORS = {
  primary: '#4CAF50',      // Green
  gold: '#FFD700',         // Gold
  dark: '#000000',         // Black
  light: '#F5F5F5',        // Light neutral
  white: '#FFFFFF',
  gray: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    500: '#6B7280',
    700: '#374151',
  },
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#3B82F6',
};

// Status indicators
export const STATUS = {
  RUNNING: 'running',
  IDLE: 'idle',
  PAUSED: 'paused',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
};

// Alert types
export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

// Device status
export const DEVICE_STATUS = {
  ACTIVE: 'active',
  IDLE: 'idle',
  OFFLINE: 'offline',
  ERROR: 'error',
};

// Temperature ranges (Fahrenheit)
export const TEMPERATURE_RANGE = {
  MIN: 50,
  MAX: 200,
  DEFAULT: 140,
};

// Humidity ranges (Percentage)
export const HUMIDITY_RANGE = {
  MIN: 0,
  MAX: 100,
  OPTIMAL_MIN: 30,
  OPTIMAL_MAX: 60,
};

// Fan speed ranges (Percentage)
export const FAN_SPEED_RANGE = {
  MIN: 0,
  MAX: 100,
  DEFAULT: 50,
};

// Time intervals
export const TIME_INTERVALS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

// Navigation items
export const NAVIGATION = [
  { id: 'dashboard', label: 'Dashboard', icon: 'FaHome' },
  { id: 'control', label: 'Control', icon: 'FaGear' },
  { id: 'analytics', label: 'Analytics', icon: 'FaChartLine' },
  { id: 'alerts', label: 'Alerts', icon: 'FaBell' },
  { id: 'settings', label: 'Settings', icon: 'FaCog' },
];

// Mock user preferences
export const DEFAULT_SETTINGS = {
  temperatureUnit: 'F',
  notifications: true,
  darkMode: false,
  autoStart: false,
  maintenanceReminder: true,
};
