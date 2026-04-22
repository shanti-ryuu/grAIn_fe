import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { grainApi } from '@/api';
import { Header } from '@/components';
import { GRADIENTS, IOS_TYPOGRAPHY } from '@/utils/constants';

export default function AddDeviceScreen() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedId = deviceId.trim();
    const trimmedLocation = location.trim();

    if (!trimmedId) {
      Alert.alert('Missing Device ID', 'Please enter a Device ID (e.g. GR-001).');
      return;
    }
    if (!trimmedLocation) {
      Alert.alert('Missing Location', 'Please enter a farm name or location (e.g. Farm A, Plot 1).');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      await grainApi.devices.register(trimmedId, trimmedLocation);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Connection Failed', err?.message || 'Could not register device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <LinearGradient colors={GRADIENTS.dashboard} style={styles.gradient}>
        <Header />
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="hardware-chip-outline" size={40} color="#22C55E" />
          </View>

          <Text style={styles.title}>Connect Your Dryer</Text>
          <Text style={styles.subtitle}>
            Enter the Device ID printed on your grain dryer unit and assign it a location.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Device ID</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}><Ionicons name="barcode-outline" size={20} color="#9CA3AF" /></View>
              <TextInput
                style={styles.input}
                placeholder="e.g. GR-001"
                placeholderTextColor="#9CA3AF"
                value={deviceId}
                onChangeText={setDeviceId}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Location / Farm Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}><Ionicons name="location-outline" size={20} color="#9CA3AF" /></View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Farm A, Plot 1"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.connectButton, isSubmitting && styles.connectButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="link-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.connectButtonText}>Connect Device</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    ...IOS_TYPOGRAPHY.largeTitle,
    color: '#111111',
    marginBottom: 8,
  },
  subtitle: {
    ...IOS_TYPOGRAPHY.footnote,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
    maxWidth: 280,
  },
  form: {
    width: '100%',
  },
  label: {
    ...IOS_TYPOGRAPHY.footnote,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...IOS_TYPOGRAPHY.body,
    color: '#111111',
    paddingVertical: 0,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#22C55E',
    borderRadius: 50,
    height: 52,
    marginTop: 32,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  connectButtonDisabled: {
    opacity: 0.7,
  },
  connectButtonText: {
    ...IOS_TYPOGRAPHY.headline,
    color: '#FFFFFF',
  },
});
