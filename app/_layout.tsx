import { Slot, Stack, Tabs } from "expo-router";
import { House } from "lucide-react-native";
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
      <Tabs.Screen name="(profile)" options={{ headerShown: false }} />
    </Tabs>
  );
}
