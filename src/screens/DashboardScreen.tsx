import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useDevices } from '@/hooks';
import { Header, Navigation, StatusBadge, LoadingSkeleton } from '@/components';
import { GRADIENTS, IOS_TYPOGRAPHY } from '@/utils/constants';
import type { Device } from '@/api';

function SkeletonDeviceCards() {
  return (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonTextBlock}>
              <View style={[styles.skeletonBar, { width: '60%' }]} />
              <View style={[styles.skeletonBar, { width: '40%', marginTop: 8 }]} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { devices: apiDevices, isLoading, error, refetch } = useDevices();
  const [devices, setDevices] = useState<Device[]>(apiDevices);
  const [refreshing, setRefreshing] = useState(false);

  // Sync API devices into state
  useEffect(() => {
    setDevices(apiDevices);
  }, [apiDevices]);

  // Subscribe to Firebase realtime device statuses
  useEffect(() => {
    if (!db || apiDevices.length === 0) return

    const statusRef = ref(db, 'grain/devices')
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const firebaseDevices = snapshot.val()
      if (firebaseDevices) {
        setDevices(prev => prev.map(device => ({
          ...device,
          status: firebaseDevices[device.deviceId]?.status ?? device.status
        })))
      }
    })

    return () => off(statusRef)
  }, [apiDevices.length])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDevicePress = (device: Device) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(app)/device/${device.deviceId}` as any);
  };

  const handleAddDevice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(app)/add-device' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
        <Header />
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollView}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C55E" />}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Your Devices</Text>

            {isLoading && devices.length === 0 ? (
              <SkeletonDeviceCards />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="cloud-offline-outline" size={48} color="#6B7280" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={refetch} style={styles.retryButton} activeOpacity={0.7}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : devices.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="hardware-chip-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No Devices Paired</Text>
                <Text style={styles.emptySubtext}>Connect your grain dryer to get started</Text>
                <TouchableOpacity
                  style={styles.addDeviceButton}
                  onPress={handleAddDevice}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.addDeviceButtonText}>Add Device</Text>
                </TouchableOpacity>
              </View>
            ) : (
              devices.map((device, index) => (
                <TouchableOpacity
                  key={device._id || device.deviceId || `device-${index}`}
                  onPress={() => handleDevicePress(device)}
                  activeOpacity={0.7}
                >
                  <View style={styles.deviceCard}>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{device.name || device.deviceId}</Text>
                      <Text style={styles.deviceLocation}>{device.location || 'No location'}</Text>
                    </View>
                    <StatusBadge status={device.status === 'online' ? 'online' : 'offline'} size="md" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Animated.View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#6B7280',
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
  emptyTitle: {
    ...IOS_TYPOGRAPHY.title3,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
  },
  emptySubtext: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginBottom: 16,
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  addDeviceButtonText: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#FFFFFF',
  },
  skeletonContainer: {
    gap: 8,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonTextBlock: {
    flex: 1,
  },
  skeletonBar: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
  skeletonBadge: {
    width: 64,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
});
