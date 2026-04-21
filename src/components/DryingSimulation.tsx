import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DryingSimulationProps {
  moistureLevel?: number;
  isDrying?: boolean;
}

const GRAIN_COLORS: Record<string, string> = {
  veryWet: '#78350f',
  wet: '#a16207',
  medium: '#eab308',
  dry: '#facc15',
  veryDry: '#fef08a',
};

function getGrainColor(moisture: number): string {
  if (moisture > 60) return GRAIN_COLORS.veryWet;
  if (moisture > 40) return GRAIN_COLORS.wet;
  if (moisture > 25) return GRAIN_COLORS.medium;
  if (moisture > 15) return GRAIN_COLORS.dry;
  return GRAIN_COLORS.veryDry;
}

function getProgressColor(moisture: number): string {
  if (moisture > 60) return '#fbbf24';
  if (moisture > 25) return '#3b82f6';
  return '#22c55e';
}

export default function DryingSimulation({ moistureLevel = 15, isDrying = true }: DryingSimulationProps) {
  const [displayMoisture, setDisplayMoisture] = useState(moistureLevel);

  useEffect(() => {
    setDisplayMoisture(moistureLevel);
  }, [moistureLevel]);

  const grains = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    top: (i % 6) * 16,
    left: (i % 8) * 12,
    size: i % 3 === 0 ? 8 : i % 3 === 1 ? 10 : 12,
  }));

  const statusText = displayMoisture > 40 ? 'Drying...' : displayMoisture > 15 ? 'Nearly Done' : 'Complete';

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Drying Progress</Text>
          <View style={styles.moistureBadge}>
            <Text style={styles.moistureBadgeText}>{displayMoisture}% Moisture</Text>
          </View>
        </View>

        <View style={styles.grainArea}>
          {grains.map((grain) => (
            <View
              key={grain.id}
              style={[
                styles.grainParticle,
                {
                  width: grain.size,
                  height: grain.size,
                  top: `${grain.top}%` as any,
                  left: `${grain.left}%` as any,
                  backgroundColor: getGrainColor(displayMoisture),
                  opacity: 0.7 + (displayMoisture / 100) * 0.3,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.statusBar}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${100 - displayMoisture}%`,
                  backgroundColor: getProgressColor(displayMoisture),
                },
              ]}
            />
          </View>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  inner: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  moistureBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  moistureBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22C55E',
  },
  grainArea: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    overflow: 'hidden',
    marginBottom: 16,
  },
  grainParticle: {
    position: 'absolute',
    borderRadius: 10,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
