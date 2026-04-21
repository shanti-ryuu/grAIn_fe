import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GLASS, IOS_TYPOGRAPHY } from '@/utils/constants';

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
  { id: 'control', label: 'Control', icon: 'person-outline', activeIcon: 'person', path: '/(app)/control' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart', path: '/(app)/analytics' },
  { id: 'alerts', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications', path: '/(app)/alerts' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings', path: '/(app)/settings' },
];

const ACTIVE_COLOR = '#22C55E';
const INACTIVE_COLOR = 'rgba(0,0,0,0.3)';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (tabId: string) => {
    if (tabId === 'dashboard') return pathname.includes('dashboard') || pathname.includes('device');
    return pathname.includes(tabId);
  };

  return (
    <BlurView intensity={GLASS.intensity} tint={GLASS.tint} style={styles.container}>
      {TABS.map((tab) => {
        const active = isActive(tab.id);
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(tab.path as any); }}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={active ? tab.activeIcon : tab.icon}
              size={24}
              color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            <Text style={[styles.tabLabel, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

const NAV_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: GLASS.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: GLASS.borderColor,
    paddingTop: 6,
    paddingHorizontal: 4,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
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
  },
  activeLabel: {
    color: ACTIVE_COLOR,
    fontWeight: '600',
  },
});
