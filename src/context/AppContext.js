'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_DATA, logAuditAction } from '@/utils/api';
import { DEFAULT_SETTINGS } from '@/utils/constants';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(MOCK_DATA.dashboard);
  const [analyticsData, setAnalyticsData] = useState(MOCK_DATA.analytics);
  const [alerts, setAlerts] = useState(MOCK_DATA.alerts);
  const [devices, setDevices] = useState(MOCK_DATA.devices);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    logAuditAction('user_login', { email: userData.email });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    logAuditAction('user_logout', {});
  }, []);

  const updateDashboardData = useCallback((newData) => {
    setDashboardData((prev) => ({ ...prev, ...newData }));
    logAuditAction('dashboard_update', newData);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings updated successfully');
    logAuditAction('settings_update', newSettings);
  }, [showToast]);

  const dismissAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    logAuditAction('alert_dismissed', { alertId });
  }, []);

  const value = {
    isLoggedIn,
    user,
    dashboardData,
    analyticsData,
    alerts,
    devices,
    settings,
    loading,
    toast,
    handleLogin,
    handleLogout,
    showToast,
    updateDashboardData,
    updateSettings,
    dismissAlert,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
