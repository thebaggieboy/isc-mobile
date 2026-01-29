import { Stack } from "expo-router";
import { DefaultColors } from "@/constants/colors";

export default function ProfileLayout() {
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
        name="settings"
        options={{
          title: "Settings",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: "Security",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: "Help & Support",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}