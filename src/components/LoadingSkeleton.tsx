import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 1 }: LoadingSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.skeleton, { opacity: new Animated.Value(0.5) }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    height: 48,
    width: '100%',
    margin: 8,
  },
});
