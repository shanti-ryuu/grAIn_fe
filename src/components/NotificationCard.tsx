import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface NotificationData {
  id: string | number;
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message?: string;
  timestamp?: string;
}

interface NotificationCardProps {
  notification: NotificationData;
  onDismiss?: (id: string | number) => void;
}

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: IoniconName }> = {
  success: { bg: '#D1FAE5', text: '#059669', icon: 'checkmark-circle' },
  info: { bg: '#DBEAFE', text: '#2563EB', icon: 'information-circle' },
  warning: { bg: '#FEF3C7', text: '#D97706', icon: 'warning' },
  error: { bg: '#FEE2E2', text: '#DC2626', icon: 'alert-circle' },
};

export default function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type || 'info'] || TYPE_CONFIG.info;

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={20} color={config.text} />
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title || 'Notification'}</Text>
        {notification.message ? (
          <Text style={styles.message}>{notification.message}</Text>
        ) : null}
        {notification.timestamp ? (
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        ) : null}
      </View>
      {onDismiss ? (
        <TouchableOpacity onPress={() => onDismiss(notification.id)} style={styles.dismissButton}>
          <Ionicons name="close" size={16} color="#6B7280" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    color: '#3C3C43',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  dismissButton: {
    padding: 4,
  },
});
