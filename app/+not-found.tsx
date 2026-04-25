import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/constants';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={80} color={COLORS.primary} />

        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Screen Not Found</Text>
        <Text style={styles.message}>
          This screen doesn't exist. You may have followed an invalid link.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(app)/dashboard')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  code: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  button: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
