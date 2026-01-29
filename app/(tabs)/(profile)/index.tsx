import Profile from "@/components/Profile";
import { DefaultColors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Profile
        userName="John Doe"
        userEmail="john.doe@example.com"
        userPhone="+234 800 123 4567"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
});