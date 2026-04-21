import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Header, Navigation, ModeToggle, CustomSlider, StatusBadge } from '@/components';
import { grainApi } from '@/api';
import { GRADIENTS, GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';

export default function ControlScreen() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [isRunning, setIsRunning] = useState(true);
  const [temperature, setTemperature] = useState(65.5);
  const [fanSpeed, setFanSpeed] = useState(75);
  const [isControlling, setIsControlling] = useState(false);

  const handleStopDryer = async () => {
    Alert.alert('Stop Dryer', 'Are you sure you want to stop the dryer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Stop',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setIsControlling(true);
          try {
            await grainApi.dryer.stop('default');
            setIsRunning(false);
          } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to stop dryer');
          } finally {
            setIsControlling(false);
          }
        },
      },
    ]);
  };

  const handleStartDryer = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsControlling(true);
    try {
      await grainApi.dryer.start('default', mode, temperature, fanSpeed);
      setIsRunning(true);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to start dryer');
    } finally {
      setIsControlling(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={GRADIENTS.control} style={styles.gradient}>
        <Header />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.screenTitle}>Control System</Text>
              <Text style={styles.screenSubtitle}>Manage dryer settings and operation</Text>
            </View>
            <StatusBadge status={isRunning ? 'running' : 'idle'} size="md" />
          </View>

          <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
            <Text style={styles.cardLabel}>SYSTEM STATUS</Text>
            <View style={styles.statusRow}>
              <Ionicons name="ellipse" size={12} color="#22C55E" />
              <Text style={styles.statusTextGreen}>Running</Text>
            </View>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopDryer}
              disabled={isControlling || !isRunning}
              activeOpacity={0.7}
            >
              <Ionicons name="stop" size={20} color="#FFFFFF" />
              <Text style={styles.stopButtonText}>Stop Dryer</Text>
            </TouchableOpacity>

            <Text style={[styles.cardLabel, { marginTop: 24 }]}>OPERATING MODE</Text>
            <ModeToggle mode={mode} onModeChange={(m: string) => setMode(m as 'auto' | 'manual')} />
          </BlurView>

          {mode === 'manual' && (
            <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
              <Text style={styles.cardLabel}>ADVANCED SETTINGS</Text>
              <View style={styles.sliderSection}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Temperature</Text>
                  <Text style={styles.sliderValue}>{temperature.toFixed(1)} °C</Text>
                </View>
                <CustomSlider
                  label=""
                  value={temperature}
                  minimumValue={40}
                  maximumValue={120}
                  step={0.5}
                  unit=" °C"
                  onValueChange={setTemperature}
                />
              </View>

              <View style={styles.sliderSection}>
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
            </BlurView>
          )}

          <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
            <Text style={styles.cardLabel}>QUICK PRESETS</Text>
            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={[styles.presetButton, styles.presetHigh]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTemperature(90); setFanSpeed(100); setMode('manual'); }}
                activeOpacity={0.7}
              >
                <Ionicons name="flame-outline" size={18} color="#EF4444" />
                <Text style={styles.presetHighText}>High Speed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.presetButton, styles.presetMedium]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTemperature(65); setFanSpeed(60); setMode('manual'); }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={18} color="#D97706" />
                <Text style={styles.presetMediumText}>Medium Speed</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
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
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  glassCard: {
    backgroundColor: GLASS.backgroundColor,
    borderWidth: 1,
    borderColor: GLASS.borderColor,
    borderRadius: GLASS.borderRadius,
    padding: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: GLASS.shadowOpacity,
    shadowRadius: GLASS.shadowRadius,
    elevation: 5,
  },
  cardLabel: {
    ...IOS_TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusTextGreen: {
    ...IOS_TYPOGRAPHY.title1,
    color: '#22C55E',
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
});
