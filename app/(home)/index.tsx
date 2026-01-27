import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "@/components/Balance";
import { Account } from "@/types/schema";

const testUser: Account = {
  uid: "1",
  balance: 10_000_000,
  userName: "Sodiq",
};

export default function Home() {
  return (
    <SafeAreaView>
      <View style={styles.HomeView}>
        <Balance userName={testUser.userName} balance={testUser.balance} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  HomeView: {
    padding: 10,
  },
});
