import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { grainApi, Device } from '@/api';

export interface UseDevicesResult {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await grainApi.device.list();
      setDevices(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load devices';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    refetch,
  };
}
