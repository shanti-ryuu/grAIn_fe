import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { grainApi } from '@/api';
import { useAppContext } from '@/context/AppContext';
import { IOS_TYPOGRAPHY } from '@/utils/constants';

const HEALTH_CHECK_INTERVAL = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000]; // exponential backoff for Render cold starts

async function healthCheckWithBackoff(): Promise<boolean> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const ok = await grainApi.health.check();
    if (ok) return true;
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
    }
  }
  return false;
}

export default function ConnectionBanner() {
  const { isServerOnline, checkServerHealth } = useAppContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const ping = useCallback(async () => {
    setIsRetrying(true);
    const ok = await healthCheckWithBackoff();
    if (ok) {
      // Update AppContext state so other consumers see the server is online
      await checkServerHealth();
    } else {
      // Ensure AppContext reflects offline after all retries exhausted
      await checkServerHealth();
    }
    setIsRetrying(false);
  }, [checkServerHealth]);

  useEffect(() => {
    ping();
    intervalRef.current = setInterval(ping, HEALTH_CHECK_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ping]);

  if (isServerOnline) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
      <View style={styles.banner}>
        <Ionicons
          name={isRetrying ? 'cloud-download-outline' : 'cloud-offline-outline'}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.message}>
          {isRetrying
            ? 'Reconnecting to server…'
            : 'Cannot connect to server — Check your connection'}
        </Text>
        {!isRetrying && (
          <TouchableOpacity onPress={ping} style={styles.retryButton} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  message: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  retryText: {
    ...IOS_TYPOGRAPHY.caption1,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
