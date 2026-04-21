import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginScreen, DashboardScreen, DeviceDetailScreen } from '@/screens';
import { Device } from '@/api';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  DeviceDetail: { deviceId: string; deviceName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Dashboard"
            options={{}}
          >
            {({ navigation }) => (
              <DashboardScreen
                onDevicePress={(device: Device) => {
                  navigation.navigate('DeviceDetail', {
                    deviceId: device.id,
                    deviceName: device.name,
                  });
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="DeviceDetail"
            options={{}}
          >
            {({ route, navigation }) => (
              <DeviceDetailScreen
                deviceId={route.params.deviceId}
                onBackPress={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
