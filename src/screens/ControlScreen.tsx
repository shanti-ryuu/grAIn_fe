import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Header, Navigation, ModeToggle, CustomSlider, StatusBadge } from '@/components';
import { grainApi } from '@/api';
import type { Device } from '@/api';
import { useDevices } from '@/hooks';
import { useAppContext } from '@/context/AppContext';
import { useAIPrediction, runPrediction } from '@/hooks/useAIPrediction';
import type { SensorInput, AIPrediction } from '@/hooks/useAIPrediction';
import { GRADIENTS, IOS_TYPOGRAPHY } from '@/utils/constants';
import { DryerMode, DryerStatus } from '@/utils/enums';

export default function ControlScreen() {
  const { showToast } = useAppContext();
  const { devices, isLoading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mode, setMode] = useState<DryerMode>(DryerMode.Auto);
  const [isRunning, setIsRunning] = useState(false);
  const [temperature, setTemperature] = useState(55);
  const [fanSpeed, setFanSpeed] = useState(75);
  const [isControlling, setIsControlling] = useState(false);
  const [aiAutoStopped, setAiAutoStopped] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const deviceId = selectedDevice?.deviceId;

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0]);
    }
  }, [devices, selectedDevice]);

  // AI prediction polling in AUTO mode when running
  useEffect(() => {
    if (mode !== DryerMode.Auto || !isRunning || !deviceId) return;

    const fetchAIPrediction = async () => {
      setAiLoading(true);
      try {
        const latest = await grainApi.sensors.getLatestData(deviceId);
        const input: SensorInput = {
          deviceId,
          temperature: latest?.temperature ?? 65.5,
          humidity: latest?.humidity ?? 50,
          moisture: latest?.moisture ?? 20,
          fanSpeed: latest?.fanSpeed ?? 75,
          timeElapsed: 60,
        };
        try {
          const result = await grainApi.ai.predict(input);
          setAiPrediction({
            predictedMoisture30min: result.predictedMoisture30min,
            estimatedMinutesToTarget: result.estimatedMinutesToTarget,
            recommendation: result.recommendation,
            recommendationType: result.recommendationType,
            efficiencyScore: result.efficiencyScore,
            confidence: result.confidence,
            isDryingComplete: result.isDryingComplete,
            projectedMoistureCurve: result.projectedCurve,
            targetMoisture: result.targetMoisture,
            algorithm: result.algorithm,
          });
          // Auto-stop if drying complete
          if (result.isDryingComplete && !aiAutoStopped) {
            setAiAutoStopped(true);
            try {
              await grainApi.dryer.stop(deviceId);
              setIsRunning(false);
              Alert.alert('Drying Complete', 'Drying complete — dryer stopped by AI');
            } catch (err: any) {
              console.error('AI auto-stop failed:', err);
            }
          }
        } catch {
          const result = runPrediction(input);
          setAiPrediction(result);
          if (result.isDryingComplete && !aiAutoStopped) {
            setAiAutoStopped(true);
            try {
              await grainApi.dryer.stop(deviceId);
              setIsRunning(false);
              Alert.alert('Drying Complete', 'Drying complete — dryer stopped by AI');
            } catch (err: any) {
              console.error('AI auto-stop failed:', err);
            }
          }
        }
      } catch {
        // Sensor fetch failed
      } finally {
        setAiLoading(false);
      }
    };

    fetchAIPrediction();
    const interval = setInterval(fetchAIPrediction, 60000);
    return () => clearInterval(interval);
  }, [mode, isRunning, deviceId, aiAutoStopped]);

  const handleStopDryer = async () => {
    if (!deviceId) {
      Alert.alert('No Device', 'Please select a device first.');
      return;
    }
    Alert.alert('Stop Dryer', 'Are you sure you want to stop the dryer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Stop',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setIsControlling(true);
          try {
            await grainApi.dryer.stop(deviceId);
            setIsRunning(false);
            showToast('Dryer stopped successfully', 'success');
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to stop dryer');
            showToast(err?.message || 'Failed to stop dryer', 'error');
          } finally {
            setIsControlling(false);
          }
        },
      },
    ]);
  };

  const handleStartDryer = async () => {
    if (!deviceId) {
      Alert.alert('No Device', 'Please select a device first.');
      return;
    }
    const deviceName = selectedDevice?.name || deviceId;
    Alert.alert(
      'Start Dryer',
      `Start drying cycle?\n\nDevice: ${deviceName}\nMode: ${mode === DryerMode.Auto ? 'AI Auto' : 'Manual'}\n${mode === DryerMode.Manual ? `Temp: ${temperature.toFixed(1)}°C\nFan: ${fanSpeed}%` : 'AI will adjust settings automatically'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          style: 'default',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsControlling(true);
            try {
              await grainApi.dryer.start(deviceId, mode, temperature, fanSpeed);
              setIsRunning(true);
              setAiAutoStopped(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              showToast('Dryer started successfully', 'success');
            } catch (err: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              showToast(err?.message || 'Failed to start dryer', 'error');
            } finally {
              setIsControlling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <LinearGradient colors={GRADIENTS.control} style={styles.gradient}>
        <Header />
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.screenTitle}>Control System</Text>
              <Text style={styles.screenSubtitle}>Manage dryer settings and operation</Text>
            </View>
            <StatusBadge status={isRunning ? DryerStatus.Running : DryerStatus.Idle} size="md" />
          </View>

          {/* Device Selector */}
          {devices.length > 1 && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>SELECT DEVICE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deviceScroll}>
                {devices.map((device) => (
                  <TouchableOpacity
                    key={device._id || device.deviceId}
                    style={[
                      styles.deviceChip,
                      selectedDevice?.deviceId === device.deviceId && styles.deviceChipActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedDevice(device);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.deviceChipText,
                        selectedDevice?.deviceId === device.deviceId && styles.deviceChipTextActive,
                      ]}
                    >
                      {device.name || device.deviceId}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {devicesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22C55E" />
              <Text style={styles.loadingText}>Loading devices...</Text>
            </View>
          ) : !deviceId ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="hardware-chip-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No devices available</Text>
              <Text style={styles.emptySubtext}>Add a device from the Dashboard first</Text>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>SYSTEM STATUS</Text>
                <View style={styles.statusRow}>
                  <Ionicons name="ellipse" size={12} color={isRunning ? '#22C55E' : '#9CA3AF'} />
                  <Text style={isRunning ? styles.statusTextGreen : styles.statusTextGray}>
                    {isRunning ? 'Running' : 'Idle'}
                  </Text>
                </View>
                {selectedDevice && (
                  <Text style={styles.deviceLabel}>
                    Device: {selectedDevice.name || selectedDevice.deviceId}
                  </Text>
                )}

                {isRunning ? (
                  <TouchableOpacity
                    style={[styles.stopButton, isControlling && styles.buttonDisabled]}
                    onPress={handleStopDryer}
                    disabled={isControlling}
                    activeOpacity={0.7}
                  >
                    {isControlling ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="stop" size={20} color="#FFFFFF" />
                        <Text style={styles.stopButtonText}>Stop Dryer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.startButton, isControlling && styles.buttonDisabled]}
                    onPress={handleStartDryer}
                    disabled={isControlling}
                    activeOpacity={0.7}
                  >
                    {isControlling ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="play" size={20} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>Start Dryer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                <Text style={[styles.cardLabel, { marginTop: 24 }]}>OPERATING MODE</Text>
                <ModeToggle mode={mode} onModeChange={(m: string) => setMode(m as DryerMode)} />
              </View>

              {/* AI Auto Mode Banner */}
              {mode === DryerMode.Auto && isRunning && (
                <View style={styles.aiCard}>
                  <View style={styles.aiCardHeader}>
                    <View style={styles.aiActiveBadge}>
                      <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={styles.aiCardTitle}>AI is controlling the dryer</Text>
                  </View>
                  <Text style={styles.aiCardSubtext}>AI automatically adjusts fan speed and temperature for optimal drying</Text>
                  {aiPrediction && (
                    <>
                      <View style={styles.aiRecRow}>
                        <Ionicons
                          name={aiPrediction.recommendationType === 'optimal' ? 'checkmark-circle' : aiPrediction.recommendationType === 'warning' ? 'warning' : 'alert-circle'}
                          size={16}
                          color={aiPrediction.recommendationType === 'optimal' ? '#22C55E' : aiPrediction.recommendationType === 'warning' ? '#F59E0B' : '#EF4444'}
                        />
                        <Text style={[styles.aiRecText, { color: aiPrediction.recommendationType === 'optimal' ? '#16A34A' : aiPrediction.recommendationType === 'warning' ? '#D97706' : '#DC2626' }]}>
                          {aiPrediction.recommendation}
                        </Text>
                      </View>
                      {!aiPrediction.isDryingComplete && (
                        <Text style={styles.aiEstText}>
                          Est. completion: {Math.floor(aiPrediction.estimatedMinutesToTarget / 60)}h {aiPrediction.estimatedMinutesToTarget % 60}m
                        </Text>
                      )}
                    </>
                  )}
                  {aiLoading && <ActivityIndicator size="small" color="#22C55E" style={{ marginTop: 4 }} />}
                  {aiAutoStopped && (
                    <View style={styles.aiStoppedBanner}>
                      <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                      <Text style={styles.aiStoppedText}>Auto-stopped by AI — target moisture reached</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Manual sliders — disabled in auto mode */}
              <View style={[styles.card, mode === DryerMode.Auto && styles.cardDisabled]}>
                <Text style={styles.cardLabel}>ADVANCED SETTINGS</Text>
                {mode === DryerMode.Auto && (
                  <View style={styles.disabledOverlay}>
                    <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.disabledText}>Manual control disabled in Auto mode</Text>
                  </View>
                )}
                <View style={[styles.sliderSection, mode === DryerMode.Auto && styles.sliderDisabled]}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>Temperature</Text>
                    <Text style={styles.sliderValue}>{temperature.toFixed(1)} °C</Text>
                  </View>
                  <CustomSlider
                    label=""
                    value={temperature}
                    minimumValue={30}
                    maximumValue={70}
                    step={0.5}
                    unit=" °C"
                    onValueChange={setTemperature}
                  />
                </View>

                <View style={[styles.sliderSection, mode === DryerMode.Auto && styles.sliderDisabled]}>
                  <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>Fan Speed</Text>
                    <Text style={styles.sliderValue}>{fanSpeed} %</Text>
                  </View>
                  <CustomSlider
                    label=""
                    value={fanSpeed}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    unit=" %"
                    onValueChange={setFanSpeed}
                  />
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>QUICK PRESETS</Text>
                <View style={styles.presetsRow}>
                  <TouchableOpacity
                    style={[styles.presetButton, styles.presetHigh]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTemperature(90); setFanSpeed(100); setMode(DryerMode.Manual); }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="flame-outline" size={18} color="#EF4444" />
                    <Text style={styles.presetHighText}>High Speed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.presetButton, styles.presetMedium]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTemperature(65); setFanSpeed(60); setMode(DryerMode.Manual); }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="settings-outline" size={18} color="#D97706" />
                    <Text style={styles.presetMediumText}>Medium Speed</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
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
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  screenTitle: {
    ...IOS_TYPOGRAPHY.largeTitle,
    color: '#111111',
  },
  screenSubtitle: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginTop: 2,
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
  cardLabel: {
    ...IOS_TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  deviceScroll: {
    flexDirection: 'row',
  },
  deviceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  deviceChipActive: {
    backgroundColor: '#22C55E',
  },
  deviceChipText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: '#6B7280',
  },
  deviceChipTextActive: {
    color: '#FFFFFF',
  },
  deviceLabel: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusTextGreen: {
    ...IOS_TYPOGRAPHY.title1,
    color: '#22C55E',
  },
  statusTextGray: {
    ...IOS_TYPOGRAPHY.title1,
    color: '#9CA3AF',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    borderRadius: 50,
    paddingVertical: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.headline,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#22C55E',
    borderRadius: 50,
    paddingVertical: 12,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.headline,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  sliderSection: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '500',
    color: '#111111',
  },
  sliderValue: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
    color: '#22C55E',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 50,
  },
  presetHigh: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  presetHighText: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
    color: '#EF4444',
  },
  presetMedium: {
    backgroundColor: 'rgba(217,119,6,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.2)',
  },
  presetMediumText: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
    color: '#D97706',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    ...IOS_TYPOGRAPHY.title3,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
  },
  emptySubtext: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
  },
  aiCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    gap: 6,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiActiveBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardTitle: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#16A34A',
  },
  aiCardSubtext: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
  },
  aiRecRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  aiRecText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '500',
    flex: 1,
  },
  aiEstText: {
    ...IOS_TYPOGRAPHY.caption1,
    color: '#6B7280',
    marginTop: 2,
  },
  aiStoppedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  aiStoppedText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: '#16A34A',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  disabledOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  disabledText: {
    ...IOS_TYPOGRAPHY.caption1,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sliderDisabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
});
