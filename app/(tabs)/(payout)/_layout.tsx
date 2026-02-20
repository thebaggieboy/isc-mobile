import { Stack, useRouter, useNavigationContainerRef } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { useEffect } from "react";

export default function PayoutLayout() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  // When the payout tab is focused, pop back to index if we're on a nested screen
  useEffect(() => {
    const unsubscribe = navigationRef?.addListener?.('state', () => {
      // Navigation state changed — handled by Expo Router
    });
    return unsubscribe;
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: DefaultColors.background,
        },
        headerTintColor: DefaultColors.white,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
