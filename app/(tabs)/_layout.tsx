// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { House, PiggyBank, Banknote, User } from "lucide-react-native";
import { DefaultColors } from "@/constants/colors";

import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "@/services/notification.service";

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) console.log("Push token registered:", token);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: DefaultColors.black,
          borderTopWidth: 1,
          borderTopColor: "#222",
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: "#ff4444",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(tabs)/(home)");
          },
        }}
      />
      <Tabs.Screen
        name="(deposit)"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <PiggyBank color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(tabs)/(deposit)");
          },
        }}
      />
      <Tabs.Screen
        name="(payout)"
        options={{
          title: "Payouts",
          tabBarIcon: ({ color, size }) => (
            <Banknote color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(tabs)/(payout)");
          },
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(tabs)/(profile)");
          },
        }}
      />
    </Tabs>
  );
}