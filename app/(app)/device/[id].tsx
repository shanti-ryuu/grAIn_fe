import { useLocalSearchParams } from 'expo-router';
import DeviceDetailScreen from '@/screens/DeviceDetailScreen';

export default function DeviceDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DeviceDetailScreen deviceId={id} />;
}
