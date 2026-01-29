// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { House, PiggyBank, Banknote, User } from "lucide-react-native";
import { DefaultColors } from "@/constants/colors";

export default function TabsLayout() {
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
      />
      <Tabs.Screen
        name="(deposit)"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <PiggyBank color={color} size={size} />
          ),
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
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}