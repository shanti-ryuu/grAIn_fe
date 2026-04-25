import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { grainApi } from '@/api';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000]; // exponential backoff for Render cold starts

async function healthCheckWithBackoff(): Promise<boolean> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ok = await grainApi.health.check();
      if (ok) return true;
    } catch {
      // network error, retry
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
    }
  }
  return false;
}

export default function NetworkBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRetrying(true);
    const ok = await healthCheckWithBackoff();
    setIsOffline(!ok);
    setIsRetrying(false);
  }, []);

  useEffect(() => {
    checkHealth();

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkHealth();
      }
    });

    const interval = setInterval(checkHealth, 30000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [checkHealth]);

  if (!isOffline && !isRetrying) return null;

  if (isRetrying && !isOffline) {
    return (
      <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.reconnectingBanner}>
        <Ionicons name="cloud-download-outline" size={16} color="#FFFFFF" />
        <Text style={styles.text}>Reconnecting to server…</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
      <Text style={styles.text}>Cannot connect to server. Check your connection.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  reconnectingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F97316',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
