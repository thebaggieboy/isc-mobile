// app/_layout.tsx
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { useEffect, useState } from "react";
import PreloaderScreen from "@/components/PreloaderScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const initializeApp = async () => {
      try {
        // Wait for preloader animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for auth token
        const token = await AsyncStorage.getItem("accessToken");

        setIsLoading(false);

        const inAuthGroup = segments[0] === '(auth)';

        if (token) {
          // If logged in but in auth group (login/signup/onboarding), go to home
          if (inAuthGroup) {
            router.replace('/(tabs)/(home)');
          }
        } else {
          // If not logged in and not in auth group, go to onboarding
          if (!inAuthGroup) {
            router.replace('/(auth)/onboarding');
          }
        }
      } catch (error) {
        console.error('Init error:', error);
        setIsLoading(false);
        router.replace('/(auth)/onboarding');
      }
    };

    initializeApp();
  }, [navigationState?.key]);

  if (isLoading) {
    return <PreloaderScreen />;
  }

  return (
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
  );
}