import { Slot, Stack, Tabs } from "expo-router";
import { House, PiggyBank, Banknote, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <House color={focused ? color : "#ccc"} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(deposit)"
        options={{
          headerShown: false,
          title: "Add",
          tabBarIcon: ({ color, size, focused }) => (
            <PiggyBank color={focused ? color : "#ccc"} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(payout)"
        options={{
          headerShown: false,
          title: "Payouts",
          tabBarIcon: ({ color, size, focused }) => (
            <Banknote color={focused ? color : "#ccc"} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <User color={focused ? color : "#ccc"} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}