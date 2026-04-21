import { useEffect, useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { grainApi, SensorData } from '@/api';

export interface UseSensorDataResult {
  sensorData: SensorData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const POLL_INTERVAL_MS = 30000; // 30 seconds

export function useSensorData(deviceId: string): UseSensorDataResult {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSensorData = useCallback(async () => {
    if (!deviceId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await grainApi.sensors.getData(deviceId);
      setSensorData(response.data[0] || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load sensor data';
      setError(errorMessage);
      console.error('Sensor data fetch error:', err);
      // Don't show alert for every poll error
      // Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  const refetch = useCallback(async () => {
    await fetchSensorData();
  }, [fetchSensorData]);

  // Set up polling
  useEffect(() => {
    if (!deviceId) return;

    // Fetch immediately
    fetchSensorData();

    // Set up interval for polling
    pollIntervalRef.current = setInterval(() => {
      fetchSensorData();
    }, POLL_INTERVAL_MS);

    // Cleanup interval on unmount or when deviceId changes
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [deviceId, fetchSensorData]);

  return {
    sensorData,
    isLoading: isLoading && sensorData === null, // Only show loading on first fetch
    error,
    refetch,
  };
}
