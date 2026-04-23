import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { grainApi } from '@/api';

export default function NetworkBanner() {
  const [isOffline, setIsOffline] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const ok = await grainApi.health.check();
      setIsOffline(!ok);
    } catch {
      setIsOffline(true);
    }
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

  if (!isOffline) return null;

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
      <Text style={styles.text}>Cannot connect to server. Check your connection.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
