import { useState, useEffect, useCallback } from 'react';
import { grainApi } from '@/api';
import type { Device } from '@/api';

interface UseDeviceResult {
  device: Device | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDevice(deviceId: string | undefined): UseDeviceResult {
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevice = useCallback(async () => {
    if (!deviceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await grainApi.devices.getById(deviceId);
      setDevice(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch device');
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchDevice();
  }, [fetchDevice]);

  return { device, isLoading, error, refetch: fetchDevice };
}
