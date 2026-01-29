// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { DefaultColors } from "@/constants/colors";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: DefaultColors.background,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen 
        name="onboarding" 
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}