import React, { createContext, useContext, useState, useCallback } from 'react';
import { grainApi } from '@/api';
import type { User, Device, AlertItem } from '@/api';
import { useAuth } from '@/hooks';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

interface AppContextType {
  user: User | null;
  alerts: AlertItem[];
  devices: Device[];
  settings: any;
  isLoading: boolean;
  isServerOnline: boolean;
  toast: ToastState;
  handleLogout: () => Promise<void>;
  showToast: (message: string, type?: ToastState['type']) => void;
  hideToast: () => void;
  refreshData: () => Promise<void>;
  checkServerHealth: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  alerts: [],
  devices: [],
  settings: null,
  isLoading: false,
  isServerOnline: true,
  toast: { message: '', type: 'info', visible: false },
  handleLogout: async () => {},
  showToast: () => {},
  hideToast: () => {},
  refreshData: async () => {},
  checkServerHealth: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { logout: authLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(true);
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

  const checkServerHealth = useCallback(async () => {
    try {
      const online = await grainApi.health.check();
      setIsServerOnline(online);
    } catch {
      setIsServerOnline(false);
    }
  }, []);

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
        isServerOnline,
        toast,
        handleLogout,
        showToast,
        hideToast,
        refreshData,
        checkServerHealth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export default AppContext;
