import Payout from "@/components/Payouts";
import { DefaultColors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function PayoutScreen() {
  // Enhanced mock data with more variety
  const mockPayouts = [
    {
      id: "1",
      amount: 50000,
      lockDate: new Date(2026, 0, 15), // Jan 15, 2026
      unlockDate: new Date(2026, 1, 15), // Feb 15, 2026
      status: "locked" as const,
      interval: "30 Day Lock",
    },
    {
      id: "2",
      amount: 25000,
      lockDate: new Date(2026, 0, 20), // Jan 20, 2026
      unlockDate: new Date(2026, 1, 5), // Feb 5, 2026
      status: "pending" as const,
      interval: "7 Day Lock",
    },
    {
      id: "3",
      amount: 100000,
      lockDate: new Date(2025, 11, 20), // Dec 20, 2025
      unlockDate: new Date(2026, 0, 20), // Jan 20, 2026
      status: "unlocked" as const,
      interval: "90 Day Lock",
    },
    {
      id: "4",
      amount: 75000,
      lockDate: new Date(2025, 11, 1), // Dec 1, 2025
      unlockDate: new Date(2025, 11, 15), // Dec 15, 2025
      status: "unlocked" as const,
      interval: "14 Day Lock",
    },
    {
      id: "5",
      amount: 35000,
      lockDate: new Date(2026, 0, 10), // Jan 10, 2026
      unlockDate: new Date(2026, 1, 24), // Feb 24, 2026
      status: "locked" as const,
      interval: "45 Day Lock",
    },
    {
      id: "6",
      amount: 60000,
      lockDate: new Date(2025, 10, 15), // Nov 15, 2025
      unlockDate: new Date(2025, 11, 30), // Dec 30, 2025
      status: "unlocked" as const,
      interval: "60 Day Lock",
    },
  ];

  // Calculate totals
  const totalLocked = mockPayouts
    .filter(p => p.status === "locked")
    .reduce((sum, p) => sum + p.amount, 0);

  const upcomingPayout = mockPayouts
    .filter(p => p.status === "locked")
    .sort((a, b) => a.unlockDate.getTime() - b.unlockDate.getTime())[0]?.amount || 0;

  const upcomingDate = mockPayouts
    .filter(p => p.status === "locked")
    .sort((a, b) => a.unlockDate.getTime() - b.unlockDate.getTime())[0]?.unlockDate || new Date(2026, 1, 15);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Payout
        totalLocked={totalLocked}
        upcomingPayout={upcomingPayout}
        payoutDate={upcomingDate}
        payouts={mockPayouts}
        userName="Sodiq"
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