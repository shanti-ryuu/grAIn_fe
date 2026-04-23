import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkBanner from '@/components/NetworkBanner';
import GlobalToast from '@/components/GlobalToast';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <NetworkBanner />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="(auth)" options={{ animation: 'fade_from_bottom' }} />
            <Stack.Screen name="(app)" />
          </Stack>
          <GlobalToast />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
