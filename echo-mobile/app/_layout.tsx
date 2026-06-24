import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Accent } from '@/constants/theme';
import styles from '@/styles/root-layout';

// Show notifications even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootNavigator() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Accent.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="auth/login" redirect={isAuth} />
      <Stack.Screen name="(tabs)" redirect={!isAuth} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
