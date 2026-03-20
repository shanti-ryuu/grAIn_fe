'use client';
import { useState, useEffect } from 'react';

export function useFetchData(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export function useAuditLog() {
  const [logs, setLogs] = useState([]);

  const addLog = (action, details) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setLogs((prev) => [logEntry, ...prev]);
    console.log('[Audit Log]', action, details);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return { logs, addLog, clearLogs };
}
