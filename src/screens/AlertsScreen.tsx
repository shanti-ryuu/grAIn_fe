import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Header, Navigation, AlertCard } from '@/components';
import { grainApi } from '@/api';
import { GRADIENTS, GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';

interface AlertItem {
  id: string | number;
  severity: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

type FilterType = 'all' | 'info' | 'warning' | 'error';

const FILTER_CONFIG: { key: FilterType; label: string; color: string; activeBg: string }[] = [
  { key: 'all', label: 'All', color: '#22C55E', activeBg: '#22C55E' },
  { key: 'error', label: 'Critical', color: '#EF4444', activeBg: '#EF4444' },
  { key: 'warning', label: 'Warnings', color: '#F97316', activeBg: '#F97316' },
  { key: 'info', label: 'Info', color: '#3B82F6', activeBg: '#3B82F6' },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [warningAlerts, setWarningAlerts] = useState(true);
  const [infoAlerts, setInfoAlerts] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      await grainApi.sensors.getData('alerts', { limit: 50 });
      setAlerts([]);
    } catch {
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  }, [fetchAlerts]);

  const handleDismiss = (id: string | number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAlerts([]);
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={GRADIENTS.alerts} style={styles.gradient}>
        <Header />
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C55E" />}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.screenTitle}>Alerts</Text>
              <Text style={styles.alertCount}>{alerts.length} alerts</Text>
            </View>
            <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            {FILTER_CONFIG.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterButton, filter === f.key && { backgroundColor: f.activeBg }]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilter(f.key); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, filter === f.key && styles.filterActiveText]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22C55E" />
            </View>
          ) : filteredAlerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No alerts</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
            ))
          )}

          <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
            <Text style={styles.settingsTitle}>Alert Settings</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Critical Alerts</Text>
                <Text style={styles.settingDesc}>Receive critical system alerts</Text>
              </View>
              <Switch
                value={criticalAlerts}
                onValueChange={setCriticalAlerts}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Warning Alerts</Text>
                <Text style={styles.settingDesc}>Receive warning notifications</Text>
              </View>
              <Switch
                value={warningAlerts}
                onValueChange={setWarningAlerts}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Information Updates</Text>
                <Text style={styles.settingDesc}>Receive informational updates</Text>
              </View>
              <Switch
                value={infoAlerts}
                onValueChange={setInfoAlerts}
                trackColor={{ false: 'rgba(0,0,0,0.08)', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
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
  alertCount: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
  clearAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  clearAllText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: '#22C55E',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
  },
  filterActiveText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 8,
  },
  emptyText: {
    ...IOS_TYPOGRAPHY.title3,
    color: '#111111',
  },
  emptySubtext: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.5)',
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
  settingsTitle: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#111111',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2,
  },
});
