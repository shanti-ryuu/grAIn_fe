import { useState, useEffect, useCallback } from 'react';
import { grainApi } from '@/api';
import type { Device } from '@/api';

interface UseDevicesResult {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await grainApi.devices.list();
      setDevices(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch devices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { devices, isLoading, error, refetch: fetchDevices };
}
