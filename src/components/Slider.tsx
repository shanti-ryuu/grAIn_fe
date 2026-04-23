import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SliderProps {
  label?: string;
  value?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  unit?: string;
  onValueChange?: (value: number) => void;
}

export default function CustomSlider({
  label = '',
  value = 50,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  unit = '',
  onValueChange,
}: SliderProps) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const percentage = ((currentValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  const handleChange = (newValue: number) => {
    const stepped = Math.round(newValue / step) * step;
    setCurrentValue(stepped);
    onValueChange?.(stepped);
  };

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.valueText}>{currentValue}{unit}</Text>
        </View>
      ) : null}
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
        </View>
        <View
          style={[
            styles.thumb,
            { left: `${percentage}%` },
          ]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={() => {}}
          onResponderMove={(e) => {
            const x = e.nativeEvent.locationX;
            const ratio = Math.max(0, Math.min(1, x / 300));
            const newVal = minimumValue + ratio * (maximumValue - minimumValue);
            handleChange(newVal);
          }}
        />
      </View>
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{minimumValue}{unit}</Text>
        <Text style={styles.rangeText}>{maximumValue}{unit}</Text>
      </View>
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
    color: '#1c1c1e',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  trackContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: -12,
    top: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 11,
    color: '#8e8e93',
  },
});
