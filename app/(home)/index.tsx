import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "@/components/Balance";
import UpcomingCard from "@/components/Upcomingcard";
import ImpulseControl from "@/components/ImpulseControl";
import { Account } from "@/types/schema";
import { DefaultColors } from "@/constants/colors";

const testUser: Account = {
  uid: "1",
  balance: 10_000_000,
  userName: "Sodiq",
};

// Mock data for schedules
const mockSchedules = [
  {
    id: "1",
    title: "Monthly Savings",
    date: new Date(2026, 1, 1), // Feb 1, 2026
    amount: 50000,
  },
  {
    id: "2",
    title: "Rent Payment",
    date: new Date(2026, 1, 5), // Feb 5, 2026
    amount: 150000,
  },
];

// Mock data for payouts
const mockPayouts = [
  {
    id: "1",
    interval: "30 Day Lock",
    unlockDate: new Date(2026, 1, 15), // Feb 15, 2026
    amount: 75000,
  },
  {
    id: "2",
    interval: "14 Day Lock",
    unlockDate: new Date(2026, 1, 20), // Feb 20, 2026
    amount: 45000,
  },
];

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.HomeView}>
          <Balance userName={testUser.userName} balance={testUser.balance} />
          
          <ImpulseControl
            savedThisMonth={350000}
            impulsesStopped={12}
            currentStreak={8}
            savingsGoal={500000}
          />
          
          <UpcomingCard 
            schedules={mockSchedules}
            payouts={mockPayouts}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  scrollView: {
    flex: 1,
  },
  HomeView: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
});