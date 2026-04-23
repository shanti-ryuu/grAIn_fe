import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { IOS_TYPOGRAPHY } from '@/utils/constants';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  id: string;
  label: string;
  icon: IoniconName;
  activeIcon: IoniconName;
  path: string;
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid', path: '/(app)/dashboard' },
  { id: 'control', label: 'Control', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip', path: '/(app)/control' },
  { id: 'ai-prediction', label: 'AI', icon: 'sparkles-outline', activeIcon: 'sparkles', path: '/(app)/ai-prediction' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart', path: '/(app)/analytics' },
  { id: 'alerts', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications', path: '/(app)/alerts' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings', path: '/(app)/settings' },
];

const ACTIVE_COLOR = '#22C55E';
const INACTIVE_COLOR = '#9CA3AF';

interface AnimatedIconProps {
  name: IoniconName;
  color: string;
  focused: boolean;
}

function AnimatedIcon({ name, color, focused }: AnimatedIconProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2, { damping: 10 });
    } else {
      scale.value = withSpring(1, { damping: 12 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (tabId: string) => {
    if (tabId === 'dashboard') return pathname.includes('dashboard') || pathname.includes('device');
    return pathname.includes(tabId);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = isActive(tab.id);
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(tab.path as any); }}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <AnimatedIcon
              name={active ? tab.activeIcon : tab.icon}
              color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              focused={active}
            />
            <Text style={[styles.tabLabel, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabLabel: {
    ...IOS_TYPOGRAPHY.caption2,
    color: INACTIVE_COLOR,
    fontWeight: '600',
    fontSize: 11,
  },
  activeLabel: {
    color: ACTIVE_COLOR,
    fontWeight: '600',
  },
});
