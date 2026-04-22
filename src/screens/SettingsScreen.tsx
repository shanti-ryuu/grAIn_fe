import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAppContext } from '@/context/AppContext';
import { Header, Navigation, StatusBadge } from '@/components';
import { DEFAULT_SETTINGS, GRADIENTS, IOS_TYPOGRAPHY } from '@/utils/constants';

export default function SettingsScreen() {
  const { handleLogout, showToast } = useAppContext();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSetting = (key: string, value: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings((prev) => ({ ...prev, [key]: value }));
    showToast('Setting updated', 'success');
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <LinearGradient colors={GRADIENTS.settings} style={styles.gradient}>
        <Header />
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={{ flex: 1 }}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenTitle}>Settings</Text>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>CONNECTED DEVICES</Text>
            <View style={styles.deviceRow}>
              <View style={styles.deviceInfo}>
                <Ionicons name="hardware-chip-outline" size={20} color="#22C55E" />
                <View style={styles.deviceText}>
                  <Text style={styles.deviceName}>Grain Dryer #1</Text>
                  <Text style={styles.deviceSub}>Main drying unit</Text>
                </View>
              </View>
              <StatusBadge status="running" size="sm" />
            </View>
            <View style={styles.deviceRow}>
              <View style={styles.deviceInfo}>
                <Ionicons name="hardware-chip-outline" size={20} color="rgba(0,0,0,0.3)" />
                <View style={styles.deviceText}>
                  <Text style={styles.deviceName}>Grain Dryer #2</Text>
                  <Text style={styles.deviceSub}>Secondary unit</Text>
                </View>
              </View>
              <StatusBadge status="offline" size="sm" />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>PREFERENCES</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Temperature Unit</Text>
                <Text style={styles.settingDesc}>Display temperature in °F or °C</Text>
              </View>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, settings.temperatureUnit === 'F' && styles.unitActive]}
                  onPress={() => updateSetting('temperatureUnit', 'F')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.unitText, settings.temperatureUnit === 'F' && styles.unitActiveText]}>°F</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, settings.temperatureUnit === 'C' && styles.unitActive]}
                  onPress={() => updateSetting('temperatureUnit', 'C')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.unitText, settings.temperatureUnit === 'C' && styles.unitActiveText]}>°C</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDesc}>Enable push notifications</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(v) => updateSetting('notifications', v)}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto Start</Text>
                <Text style={styles.settingDesc}>Automatically start dryer at scheduled time</Text>
              </View>
              <Switch
                value={settings.autoStart}
                onValueChange={(v) => updateSetting('autoStart', v)}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Maintenance Reminder</Text>
                <Text style={styles.settingDesc}>Get reminders for scheduled maintenance</Text>
              </View>
              <Switch
                value={settings.maintenanceReminder}
                onValueChange={(v) => updateSetting('maintenanceReminder', v)}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  screenTitle: {
    ...IOS_TYPOGRAPHY.largeTitle,
    color: '#111111',
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
    marginBottom: 8,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deviceText: {
    flex: 1,
  },
  deviceName: {
    ...IOS_TYPOGRAPHY.body,
    color: '#111111',
  },
  deviceSub: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    ...IOS_TYPOGRAPHY.body,
    color: '#111111',
  },
  settingDesc: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    marginTop: 2,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    padding: 2,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  unitActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unitText: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  unitActiveText: {
    color: '#22C55E',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    borderRadius: 50,
    paddingVertical: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    ...IOS_TYPOGRAPHY.headline,
  },
});
