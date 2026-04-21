import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDevices } from '@/hooks';
import { Device } from '@/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#e8f5e9',
  },
  scrollContent: {
    padding: 16,
  },
  deviceList: {
    marginTop: 8,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconText: {
    fontSize: 24,
  },
  deviceContent: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusRunning: {
    color: '#2E7D32',
  },
  statusOffline: {
    color: '#999',
  },
  statusIdle: {
    color: '#ff9800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface DashboardScreenProps {
  onDevicePress?: (device: Device) => void;
}

export default function DashboardScreen({ onDevicePress }: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const { devices, isLoading, refetch } = useDevices();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return '#2E7D32';
      case 'idle':
        return '#ff9800';
      case 'offline':
        return '#999';
      default:
        return '#666';
    }
  };

  const getStatusDisplay = (device: Device) => {
    const status = device.status || 'offline';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderDeviceCard = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => onDevicePress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceIcon}>
        <Text style={styles.deviceIconText}>🌾</Text>
      </View>
      <View style={styles.deviceContent}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceStatus}>
          {item.location ? `Location: ${item.location}` : 'No location'}
        </Text>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: getStatusColor(item.status),
              },
            ]}
          >
            {getStatusDisplay(item)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.greeting}>grAIn</Text>
          <Text style={styles.subheading}>Loading your devices...</Text>
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
        <Text style={styles.greeting}>🌾 My Dryers</Text>
        <Text style={styles.subheading}>
          {devices.length} device{devices.length !== 1 ? 's' : ''} online
        </Text>
      </View>

      {devices.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={[
            styles.scrollContent,
            styles.emptyState,
          ]}
        >
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No Devices</Text>
          <Text style={styles.emptySubtext}>
            You don't have any grain dryers configured yet.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDeviceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          scrollEnabled={true}
        />
      )}
    </View>
  );
}
