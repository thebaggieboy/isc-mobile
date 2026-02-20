// app/_layout.tsx
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { useEffect, useState } from "react";
import PreloaderScreen from "@/components/PreloaderScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { PaystackProvider } from '@/components/Providers/PaystackProvider';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<string | null>(null);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // 1. Initialize App (Check Token) - Independent of Navigation
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for preloader animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for auth token
        const token = await AsyncStorage.getItem("accessToken");
        setSession(token);
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // 2. Handle Navigation - Depends on Navigation State & Initialization
  useEffect(() => {
    if (!isReady || !navigationState?.key) return;

    const performCheck = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setSession(token);

      const inAuthGroup = segments[0] === '(auth)';

      if (token) {
        // If logged in but in auth group (login/signup/onboarding), go to home
        if (inAuthGroup) {
          router.replace('/(tabs)/(home)');
        }
      } else {
        // If not logged in and not in auth group, go to onboarding/login
        if (!inAuthGroup) {
          router.replace('/(auth)/onboarding');
        }
      }
    };

    performCheck();
  }, [isReady, segments, navigationState?.key]);

  if (!isReady) {
    return <PreloaderScreen />;
  }

  return (
    <PaystackProvider publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here'}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: DefaultColors.background,
          },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
    </PaystackProvider>
  );
}