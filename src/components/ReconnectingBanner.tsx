import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ReconnectingBanner() {
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-download-outline" size={16} color="#FFFFFF" />
      <Text style={styles.message}>Reconnecting to server...</Text>
    </View>
  );
}

export default ReconnectingBanner;

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
