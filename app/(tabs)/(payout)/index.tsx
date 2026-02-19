import Payout from "@/components/Payouts";
import { DefaultColors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { scheduleService } from "@/services/api/schedule.service";

export default function PayoutScreen() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getPayouts();
      setPayouts(data);
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayouts();
  };

  // Calculate totals
  const totalLocked = payouts
    .filter(p => p.status === "locked")
    .reduce((sum, p) => sum + p.amount, 0);

  const upcomingPayoutObj = payouts
    .filter(p => p.status === "locked")
    .sort((a, b) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())[0];

  const upcomingPayout = upcomingPayoutObj?.amount || 0;

  const upcomingDate = upcomingPayoutObj
    ? new Date(upcomingPayoutObj.unlockDate)
    : null; // Changed from default date to null

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
        totalLocked={totalLocked}
        upcomingPayout={upcomingPayout}
        payoutDate={upcomingDate}
        payouts={payouts}
        userName="User" // TODO: Get from context or service
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