import { useState, useEffect, useCallback, useRef } from 'react';
import { grainApi } from '@/api';
import type { SensorData } from '@/api';

interface UseSensorDataResult {
  sensorData: SensorData[];
  latestData: SensorData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSensorData(deviceId: string | undefined, pollInterval: number = 30000): UseSensorDataResult {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!deviceId) return;
    try {
      const data = await grainApi.sensors.getData(deviceId, { hours: 24 });
      setSensorData(data.data);
      setLatestData(data.data[0] || null);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch sensor data');
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, pollInterval]);

  return { sensorData, latestData, isLoading, error, refetch: fetchData };
}
