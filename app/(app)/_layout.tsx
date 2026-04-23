import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="control" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="ai-prediction" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="device/[id]" />
      <Stack.Screen name="add-device" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
