import { Stack } from "expo-router";
import { DefaultColors } from "@/constants/colors";

export default function PayoutLayout() {
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
          title: "Payout Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}


