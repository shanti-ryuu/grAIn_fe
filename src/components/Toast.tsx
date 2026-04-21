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

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: IoniconName }> = {
  success: { bg: '#D1FAE5', text: '#059669', icon: 'checkmark-circle' },
  error: { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle' },
  info: { bg: '#DBEAFE', text: '#2563EB', icon: 'information-circle' },
  warning: { bg: '#FEF3C7', text: '#D97706', icon: 'warning' },
};

export default function Toast({
  message = '',
  type = 'info',
  visible = false,
  duration = 3000,
  onHide,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

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
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  return (
    <Animated.View style={[styles.container, { backgroundColor: config.bg, opacity }]}>
      <Ionicons name={config.icon} size={18} color={config.text} />
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
