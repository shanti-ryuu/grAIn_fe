import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSensorData, useDevice } from '@/hooks';
import { grainApi } from '@/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  backButton: {
    fontSize: 24,
    marginBottom: 12,
  },
  deviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: '#e8f5e9',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sensorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  sensorUnit: {
    fontSize: 12,
    color: '#999',
  },
  controlSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  controlButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  startButton: {
    backgroundColor: '#2E7D32',
  },
  stopButton: {
    backgroundColor: '#d32f2f',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});

interface DeviceDetailScreenProps {
  deviceId: string;
  onBackPress?: () => void;
}

export default function DeviceDetailScreen({
  deviceId,
  onBackPress,
}: DeviceDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { device, isLoading: deviceLoading } = useDevice(deviceId);
  const { sensorData, isLoading: sensorLoading, error, refetch } = useSensorData(deviceId);
  const [refreshing, setRefreshing] = useState(false);
  const [controlling, setControlling] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartDryer = async () => {
    Alert.alert(
      'Start Dryer',
      `Start drying on ${device?.name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: async () => {
            setControlling(true);
            try {
              await grainApi.device.startDryer(deviceId);
              Alert.alert('Success', 'Dryer started successfully');
              await refetch();
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to start dryer'
              );
            } finally {
              setControlling(false);
            }
          },
          style: 'default',
        },
      ]
    );
  };

  const handleStopDryer = async () => {
    Alert.alert(
      'Stop Dryer',
      `Stop drying on ${device?.name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Stop',
          onPress: async () => {
            setControlling(true);
            try {
              await grainApi.device.stopDryer(deviceId);
              Alert.alert('Success', 'Dryer stopped successfully');
              await refetch();
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to stop dryer'
              );
            } finally {
              setControlling(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (deviceLoading || (!device && !sensorData)) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={onBackPress}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.deviceTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.deviceTitle}>{device?.name || 'Device Details'}</Text>
        <Text style={styles.deviceStatus}>
          Status: {device?.status || 'Unknown'}
        </Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.content}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {sensorLoading && !sensorData ? (
          <View style={[styles.loadingContainer, { height: 200 }]}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        ) : sensorData ? (
          <>
            <Text style={styles.sectionTitle}>📊 Sensor Readings</Text>
            <View style={styles.sensorGrid}>
              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Temperature</Text>
                <Text style={styles.sensorValue}>{sensorData.temperature}°C</Text>
                <Text style={styles.sensorUnit}>Current</Text>
              </View>

              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Humidity</Text>
                <Text style={styles.sensorValue}>{sensorData.humidity}%</Text>
                <Text style={styles.sensorUnit}>Relative</Text>
              </View>

              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Moisture</Text>
                <Text style={styles.sensorValue}>{sensorData.moisture}%</Text>
                <Text style={styles.sensorUnit}>Grain Level</Text>
              </View>

              {sensorData.fanSpeed !== undefined && (
                <View style={styles.sensorCard}>
                  <Text style={styles.sensorLabel}>Fan Speed</Text>
                  <Text style={styles.sensorValue}>{sensorData.fanSpeed}%</Text>
                  <Text style={styles.sensorUnit}>Output</Text>
                </View>
              )}

              {sensorData.dryingTime !== undefined && (
                <View style={styles.sensorCard}>
                  <Text style={styles.sensorLabel}>Drying Time</Text>
                  <Text style={styles.sensorValue}>{sensorData.dryingTime}h</Text>
                  <Text style={styles.sensorUnit}>Elapsed</Text>
                </View>
              )}

              {sensorData.energyConsumption !== undefined && (
                <View style={styles.sensorCard}>
                  <Text style={styles.sensorLabel}>Energy</Text>
                  <Text style={styles.sensorValue}>{sensorData.energyConsumption}</Text>
                  <Text style={styles.sensorUnit}>kWh</Text>
                </View>
              )}
            </View>

            <Text style={styles.timestamp}>
              Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
            </Text>
          </>
        ) : null}

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>🎮 Controls</Text>

          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={handleStartDryer}
            disabled={controlling}
          >
            {controlling ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={{ fontSize: 20 }}>▶️</Text>
                <Text style={styles.controlButtonText}>Start Dryer</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={handleStopDryer}
            disabled={controlling}
          >
            {controlling ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={{ fontSize: 20 }}>⏹️</Text>
                <Text style={styles.controlButtonText}>Stop Dryer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
