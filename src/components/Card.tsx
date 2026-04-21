import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CardProps {
  title?: string;
  value?: string | number;
  unit?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export default function Card({ title, value, unit, children, onPress }: CardProps) {
  const content = (
    <View style={styles.container}>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : null}
      {value !== undefined ? (
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22C55E',
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
