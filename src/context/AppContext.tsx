import React, { createContext, useContext, useState, useCallback } from 'react';
import { grainApi } from '@/api';
import type { User } from '@/api';
import { useAuth } from '@/hooks';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

interface AppContextType {
  user: User | null;
  alerts: any[];
  devices: any[];
  settings: any;
  isLoading: boolean;
  toast: ToastState;
  handleLogout: () => Promise<void>;
  showToast: (message: string, type?: ToastState['type']) => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  alerts: [],
  devices: [],
  settings: null,
  isLoading: false,
  toast: { message: '', type: 'info', visible: false },
  handleLogout: async () => {},
  showToast: () => {},
  hideToast: () => {},
  refreshData: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { logout: authLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await grainApi.auth.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setAlerts([]);
      setDevices([]);
      setSettings(null);
      authLogout();
    }
  }, [authLogout]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, devicesData] = await Promise.allSettled([
        grainApi.auth.getCurrentUser(),
        grainApi.devices.list(),
      ]);

      if (userData.status === 'fulfilled') setUser(userData.value);
      if (devicesData.status === 'fulfilled') setDevices(devicesData.value);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        alerts,
        devices,
        settings,
        isLoading,
        toast,
        handleLogout,
        showToast,
        hideToast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default AppContext;
