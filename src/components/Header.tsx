import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';

export default function Header() {
  const { handleLogout } = useAppContext();

  const confirmLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Grain Dryer System</Text>
        </View>
        <TouchableOpacity
          onPress={confirmLogout}
          style={styles.logoutButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={22} color="rgba(0,0,0,0.4)" />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLASS.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: GLASS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  title: {
    ...IOS_TYPOGRAPHY.callout,
    fontWeight: '600',
    color: '#111111',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
});
