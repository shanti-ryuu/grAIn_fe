import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useDevice, useRealtimeSensor } from '@/hooks';
import { StatusBadge, Header, Navigation, DryingSimulation, ProgressBar } from '@/components';
import { grainApi } from '@/api';
import { GRADIENTS, IOS_TYPOGRAPHY } from '@/utils/constants';

interface DeviceDetailScreenProps {
  deviceId?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DeviceDetailScreen({ deviceId }: DeviceDetailScreenProps) {
  const router = useRouter();
  const { device, isLoading: deviceLoading, error: deviceError } = useDevice(deviceId);
  const { sensorData: realtimeData, isOnline: realtimeOnline, lastUpdated } = useRealtimeSensor(device?.deviceId);
  const [isControlling, setIsControlling] = useState(false);

  const handleStartDryer = async () => {
    if (!deviceId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsControlling(true);
    try {
      await grainApi.dryer.start(deviceId, 'auto');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to start dryer');
    } finally {
      setIsControlling(false);
    }
  };

  const handleStopDryer = async () => {
    if (!deviceId) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsControlling(true);
    try {
      await grainApi.dryer.stop(deviceId);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to stop dryer');
    } finally {
      setIsControlling(false);
    }
  };

  if (deviceLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
          <ActivityIndicator size="large" color="#22C55E" />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (deviceError || !device) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{deviceError || 'Device not found'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const moisture = realtimeData?.moisture ?? 18.5;
  const temperature = realtimeData?.temperature ?? 65.5;
  const humidity = realtimeData?.humidity ?? 42.3;
  const energy = realtimeData?.energy ?? 2.4;
  const fanSpeed = realtimeData?.fanSpeed ?? 75;
  const status = realtimeData?.status ?? 'idle';
  const isOnline = realtimeOnline || device.status === 'online';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
        <Header />
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>{getGreeting()}, Farmer</Text>
              <Text style={styles.greetingSub}>Monitor your grain dryer</Text>
            </View>
            <View style={styles.statusRow}>
              <StatusBadge status={isOnline ? 'running' : 'offline'} size="md" />
              {isOnline && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>
          </View>

          <DryingSimulation moistureLevel={moisture} isDrying={isOnline} />

          <View style={styles.card}>
            <ProgressBar
              progress={45}
              timeRemaining="2h 30m"
              showLabel={true}
              showTime={true}
            />
          </View>

          <View style={styles.sensorGrid}>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(249,115,22,0.1)' }]}>
                <Ionicons name="thermometer-outline" size={22} color="#F97316" />
              </View>
              <Text style={[styles.sensorValue, { color: '#F97316' }]}>{temperature} °C</Text>
              <Text style={styles.sensorLabel}>TEMPERATURE</Text>
            </View>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                <Ionicons name="water-outline" size={22} color="#22C55E" />
              </View>
              <Text style={[styles.sensorValue, { color: '#22C55E' }]}>{humidity} %</Text>
              <Text style={styles.sensorLabel}>HUMIDITY</Text>
            </View>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                <Ionicons name="analytics-outline" size={22} color="#22C55E" />
              </View>
              <Text style={[styles.sensorValue, { color: '#22C55E' }]}>{moisture} %</Text>
              <Text style={styles.sensorLabel}>MOISTURE</Text>
            </View>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                <Ionicons name="flash-outline" size={22} color="#22C55E" />
              </View>
              <Text style={[styles.sensorValue, { color: '#22C55E' }]}>{energy} kWh</Text>
              <Text style={styles.sensorLabel}>ENERGY</Text>
            </View>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(249,115,22,0.1)' }]}>
                <Ionicons name="speedometer-outline" size={22} color="#F97316" />
              </View>
              <Text style={[styles.sensorValue, { color: '#F97316' }]}>{fanSpeed} %</Text>
              <Text style={styles.sensorLabel}>FAN SPEED</Text>
            </View>
            <View style={styles.sensorCard}>
              <View style={[styles.sensorIconBg, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                <Ionicons name="pulse-outline" size={22} color="#3B82F6" />
              </View>
              <Text style={[styles.sensorValue, { color: '#3B82F6' }]}>{status.toUpperCase()}</Text>
              <Text style={styles.sensorLabel}>STATUS</Text>
            </View>
          </View>

          <View style={styles.rowCards}>
            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>STATUS</Text>
              <Text style={styles.cardValueGreen}>Running</Text>
              <Text style={styles.cardSub}>Fan Speed: {fanSpeed} %</Text>
            </View>
            <View style={styles.halfCard}>
              <Text style={styles.cardLabel}>DURATION</Text>
              <Text style={styles.cardValue}>3.5 hrs</Text>
              <Text style={styles.cardSub}>Time Running: 1h 45m</Text>
            </View>
          </View>

          <View style={styles.bottomBanner}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerDot} />
              <Text style={styles.bannerText}>System Running</Text>
            </View>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/(app)/control' as any); }}
              activeOpacity={0.7}
            >
              <Text style={styles.controlButtonText}>Control</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    ...IOS_TYPOGRAPHY.footnote,
  },
  backButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.headline,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 72,
    gap: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    ...IOS_TYPOGRAPHY.largeTitle,
    color: '#111111',
  },
  greetingSub: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  liveText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sensorCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sensorIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorValue: {
    ...IOS_TYPOGRAPHY.title1,
  },
  sensorLabel: {
    ...IOS_TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    ...IOS_TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    ...IOS_TYPOGRAPHY.title2,
    color: '#111111',
    marginBottom: 2,
  },
  cardValueGreen: {
    ...IOS_TYPOGRAPHY.title2,
    color: '#22C55E',
    marginBottom: 2,
  },
  cardSub: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  bannerText: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#111111',
  },
  controlButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  controlButtonText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
  },
});
