import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export function DashboardIcon({ size = 24, color = '#1c1c1e' }: IconProps) {
  return <Ionicons name="grid-outline" size={size} color={color} />;
}

export function ControlIcon({ size = 24, color = '#1c1c1e' }: IconProps) {
  return <Ionicons name="person-outline" size={size} color={color} />;
}

export function AnalyticsIcon({ size = 24, color = '#1c1c1e' }: IconProps) {
  return <Ionicons name="bar-chart-outline" size={size} color={color} />;
}

export function AlertsIcon({ size = 24, color = '#1c1c1e' }: IconProps) {
  return <Ionicons name="notifications-outline" size={size} color={color} />;
}

export function SettingsIcon({ size = 24, color = '#1c1c1e' }: IconProps) {
  return <Ionicons name="settings-outline" size={size} color={color} />;
}

export function LogoutIcon({ size = 20, color = '#6B7280' }: IconProps) {
  return <Ionicons name="log-out-outline" size={size} color={color} />;
}
