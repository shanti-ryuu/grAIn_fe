import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { grainApi, Device } from '@/api';

export interface UseDeviceResult {
  device: Device | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDevice(deviceId: string): UseDeviceResult {
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevice = useCallback(async () => {
    if (!deviceId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await grainApi.device.getDetails(deviceId);
      setDevice(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load device';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  const refetch = useCallback(async () => {
    await fetchDevice();
  }, [fetchDevice]);

  useEffect(() => {
    fetchDevice();
  }, [fetchDevice]);

  return {
    device,
    isLoading,
    error,
    refetch,
  };
}
