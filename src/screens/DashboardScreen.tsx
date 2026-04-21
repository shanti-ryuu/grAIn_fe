import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDevices } from '@/hooks';
import { Header, Navigation, StatusBadge } from '@/components';
import { GRADIENTS, GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';
import type { Device } from '@/api';

export default function DashboardScreen() {
  const router = useRouter();
  const { devices, isLoading, error, refetch } = useDevices();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDevicePress = (device: Device) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(app)/device/${device._id}` as any);
  };

  if (isLoading && devices.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
        <Header />
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C55E" />}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Your Devices</Text>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="cloud-offline-outline" size={48} color="#6B7280" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={refetch} style={styles.retryButton} activeOpacity={0.7}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : devices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="hardware-chip-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No devices found</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
            </View>
          ) : (
            devices.map((device, index) => (
              <TouchableOpacity
                key={device._id || device.deviceId || `device-${index}`}
                onPress={() => handleDevicePress(device)}
                activeOpacity={0.7}
              >
                <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.deviceCard}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name || device.deviceId}</Text>
                    <Text style={styles.deviceLocation}>{device.location || 'No location'}</Text>
                  </View>
                  <StatusBadge status={device.status === 'online' ? 'online' : 'offline'} size="md" />
                </BlurView>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        <Navigation />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    color: 'rgba(0,0,0,0.5)',
    ...IOS_TYPOGRAPHY.footnote,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 72,
  },
  sectionTitle: {
    ...IOS_TYPOGRAPHY.largeTitle,
    color: '#111111',
    marginBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GLASS.backgroundColor,
    borderWidth: 1,
    borderColor: GLASS.borderColor,
    borderRadius: GLASS.borderRadius,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: GLASS.shadowOpacity,
    shadowRadius: GLASS.shadowRadius,
    elevation: 5,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#111111',
  },
  deviceLocation: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  errorText: {
    color: '#EF4444',
    ...IOS_TYPOGRAPHY.footnote,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
  },
  retryText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.headline,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    ...IOS_TYPOGRAPHY.headline,
    color: 'rgba(0,0,0,0.5)',
  },
  emptySubtext: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.3)',
  },
});
