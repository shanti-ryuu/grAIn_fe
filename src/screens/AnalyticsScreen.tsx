import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Header, Navigation } from '@/components';
import { grainApi } from '@/api';
import { GRADIENTS, GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';
import type { SensorData } from '@/api';

type PeriodType = 'daily' | 'weekly' | 'monthly';

const screenWidth = Dimensions.get('window').width - 64;

const chartConfig = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: 'transparent',
  backgroundGradientTo: 'transparent',
  decimalPlaces: 1,
  color: (opacity: number = 1) => `rgba(34, 197, 94, ${opacity})`,
  labelColor: (opacity: number = 1) => `rgba(0, 0, 0, ${opacity * 0.5})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#22C55E',
  },
};

export default function AnalyticsScreen() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('weekly');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await grainApi.sensors.getData('analytics', { hours: period === 'daily' ? 24 : period === 'weekly' ? 168 : 720 });
      setSensorData(response.data);
    } catch {
      setSensorData([]);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const periods: { key: PeriodType; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  const last6 = sensorData.slice(0, 6);
  const labels = last6.map((d) =>
    new Date(d.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  );
  const moistureData = last6.map((d) => d.moisture);
  const energyData = last6.map((d) => d.energy);
  const fanSpeedData = last6.map((d) => d.fanSpeed);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={GRADIENTS.analytics} style={styles.gradient}>
        <Header />
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C55E" />}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.screenTitle}>Analytics</Text>
          <Text style={styles.screenSubtitle}>View drying trends and performance metrics</Text>

          <View style={styles.filterRow}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.filterButton, period === p.key && styles.filterActive]}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPeriod(p.key); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, period === p.key && styles.filterActiveText]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.exportRow}>
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
              <Ionicons name="document-text-outline" size={16} color="#22C55E" />
              <Text style={styles.exportText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} activeOpacity={0.7}>
              <Ionicons name="document-attach-outline" size={16} color="#22C55E" />
              <Text style={styles.exportText}>Export PDF</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22C55E" />
            </View>
          ) : sensorData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bar-chart-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          ) : (
            <>
              <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
                <Text style={styles.chartTitle}>Moisture Levels Over Time</Text>
                <LineChart
                  data={{ labels, datasets: [{ data: moistureData }] }}
                  width={screenWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </BlurView>

              <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
                <Text style={styles.chartTitle}>Energy Consumption</Text>
                <BarChart
                  data={{ labels, datasets: [{ data: energyData.length > 0 ? energyData : [0] }] }}
                  width={screenWidth}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  yAxisLabel=""
                  yAxisSuffix="kWh"
                />
              </BlurView>

              <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.glassCard}>
                <Text style={styles.chartTitle}>Fan Speed</Text>
                <BarChart
                  data={{ labels, datasets: [{ data: fanSpeedData.length > 0 ? fanSpeedData : [0] }] }}
                  width={screenWidth}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  yAxisLabel=""
                  yAxisSuffix="%"
                />
              </BlurView>
            </>
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
  screenSubtitle: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.5)',
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
  filterActive: {
    backgroundColor: '#22C55E',
  },
  filterText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
  },
  filterActiveText: {
    color: '#FFFFFF',
  },
  exportRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#22C55E',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  exportText: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: '#22C55E',
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
  chartTitle: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#111111',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    ...IOS_TYPOGRAPHY.footnote,
    color: 'rgba(0,0,0,0.5)',
  },
});
