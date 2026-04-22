import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.skeletonCard, { opacity }]}>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonTextBlock}>
              <View style={[styles.skeletonBar, { width: '60%' }]} />
              <View style={[styles.skeletonBar, { width: '40%', marginTop: 8 }]} />
            </View>
            <View style={styles.skeletonBadge} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  skeletonCard: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonTextBlock: {
    flex: 1,
  },
  skeletonBar: {
    height: 14,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
  },
  skeletonBadge: {
    width: 64,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
  },
});
