import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ToastProps {
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  visible?: boolean;
  duration?: number;
  onHide?: () => void;
}

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: IoniconName; duration: number }> = {
  success: { bg: '#D1FAE5', text: '#059669', icon: 'checkmark-circle', duration: 2500 },
  error: { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle', duration: 5000 },
  info: { bg: '#DBEAFE', text: '#2563EB', icon: 'information-circle', duration: 3000 },
  warning: { bg: '#FEF3C7', text: '#D97706', icon: 'warning', duration: 4000 },
};

export default function Toast({
  message = '',
  type = 'info',
  visible = false,
  duration,
  onHide,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const autoDismiss = duration ?? config.duration;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide?.());
      }, autoDismiss);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: config.bg, opacity }]}>
      <Ionicons name={config.icon} size={18} color={config.text} />
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
