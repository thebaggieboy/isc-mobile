import Payout from "@/components/Payouts";
import { DefaultColors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { scheduleService } from "@/services/api/schedule.service";
import { userService } from "@/services/api/user.service";

export default function PayoutScreen() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payoutsData, balanceData] = await Promise.all([
        scheduleService.getPayouts(),
        userService.getBalance(),
      ]);
      setPayouts(payoutsData);
      setBalance(balanceData?.balance || 0);
    } catch (error) {
      console.error("Failed to fetch payout data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Total of COMPLETED/UNLOCKED payouts (Cumulative Withdrawals)
  const totalPayoutAmount = payouts
    .filter(p => p.status === 'completed' || p.status === 'unlocked')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Next upcoming payout (earliest locked one)
  const upcomingPayoutObj = payouts
    .filter(p => p.status === "locked")
    .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())[0];

  const upcomingPayout = upcomingPayoutObj?.amount || 0;
  const upcomingDate = upcomingPayoutObj ? new Date(upcomingPayoutObj.unlockDate) : null;

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator size="large" color={DefaultColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Payout
        totalLocked={totalPayoutAmount}
        upcomingPayout={upcomingPayout}
        payoutDate={upcomingDate}
        payouts={payouts}
        balance={balance}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});