// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { useEffect, useState } from "react";
import PreloaderScreen from "@/components/PreloaderScreen";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate initial loading and auth check
    const initializeApp = async () => {
      try {
        // Wait for preloader animation
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsLoading(false);
        // Redirect to onboarding only once after preloader
        setTimeout(() => router.replace('/(auth)/onboarding'), 100);
      }
    };

    initializeApp();
  }, []);

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