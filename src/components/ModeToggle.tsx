import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DryerMode } from '@/utils/enums';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface ModeToggleProps {
  mode?: DryerMode;
  onModeChange?: (mode: string) => void;
  disabled?: boolean;
}

const MODES: { id: DryerMode; label: string; icon: IoniconName }[] = [
  { id: DryerMode.Manual, label: 'Manual', icon: 'hand-left-outline' },
  { id: DryerMode.Auto, label: 'Auto', icon: 'hardware-chip-outline' },
];

export default function ModeToggle({ mode = DryerMode.Auto, onModeChange, disabled = false }: ModeToggleProps) {
  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      {MODES.map((m) => (
        <TouchableOpacity
          key={m.id}
          onPress={() => !disabled && onModeChange?.(m.id)}
          style={[styles.tab, mode === m.id && styles.activeTab]}
          activeOpacity={0.7}
        >
          <Ionicons name={m.icon} size={18} color={mode === m.id ? '#22C55E' : '#6B7280'} />
          <Text style={[styles.tabLabel, mode === m.id && styles.activeTabLabel]}>
            {m.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    padding: 4,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#22C55E',
    fontWeight: '600',
  },
});
