import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            gr<Text style={styles.titleAccent}>AI</Text>n
          </Text>
          <Text style={styles.subtitle}>IoT Grain Dryer System</Text>
        </View>

        <ActivityIndicator size="large" color="#22c55e" style={styles.loader} />

        <Text style={styles.loadingText}>Initializing System...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  logoOuter: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(34,197,94,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  titleAccent: {
    color: '#22c55e',
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
    marginTop: 4,
  },
  loader: {
    marginTop: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#3c3c43',
    fontWeight: '500',
  },
});
