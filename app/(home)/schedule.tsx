import Button from "@/components/Button";
import CreateWithdrawSchedule from "@/components/WithdrawSchedule";
import { DefaultColors } from "@/constants/colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DefaultColors.white }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titles}>
          <Text style={styles.title}>Withdraw Schedule</Text>
          <Text style={styles.subtitle}>Manage your withdrawal schedule</Text>
        </View>
        <CreateWithdrawSchedule />

        <Button
          title="Create Schedule"
          buttonStyle={styles.createButton}
          onPress={() => console.log("Schedule Created")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  titles: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: DefaultColors.black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: DefaultColors.gray,
    marginTop: 4,
  },
  createButton: {
    marginTop: 30,
    backgroundColor: DefaultColors.black,
    paddingVertical: 18,
    borderRadius: 16,
  },
});
