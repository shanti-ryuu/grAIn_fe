import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated
    ? <Redirect href="/(app)/dashboard" />
    : <Redirect href="/(auth)/login" />;
}
