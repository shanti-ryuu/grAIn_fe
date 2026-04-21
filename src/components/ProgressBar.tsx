import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress?: number;
  timeRemaining?: string;
  showLabel?: boolean;
  showTime?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_COLORS = {
  default: '#22C55E',
  warning: '#FBBF24',
  danger: '#EF4444',
  info: '#3B82F6',
  success: '#22C55E',
  orange: '#F97316',
};

const getProgressColor = (progress: number) => {
  if (progress < 33) return VARIANT_COLORS.info;
  if (progress < 66) return VARIANT_COLORS.orange;
  return VARIANT_COLORS.default;
};

export default function ProgressBar({
  progress = 45,
  timeRemaining = '2h 30m',
  showLabel = true,
  showTime = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const color = getProgressColor(progress);

  return (
    <View style={styles.container}>
      {showLabel ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>Drying Progress</Text>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
            {showTime ? <Text style={styles.timeRemaining}>• {timeRemaining}</Text> : null}
          </View>
        </View>
      ) : null}
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]}
        />
      </View>
      {showTime ? (
        <Text style={styles.timeLabel}>
          Approximately <Text style={styles.timeBold}>{timeRemaining}</Text> remaining
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  timeRemaining: {
    fontSize: 12,
    color: '#6B7280',
  },
  track: {
    width: '100%',
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  timeBold: {
    fontWeight: '600',
    color: '#111111',
  },
});
