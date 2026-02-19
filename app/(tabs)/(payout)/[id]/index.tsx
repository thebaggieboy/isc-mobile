import { useLocalSearchParams, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import {
  Lock,
  Unlock,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight
} from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/amount";
import { useEffect, useState } from "react";
import { scheduleService, PayoutItem } from "@/services/api/schedule.service";

export default function PayoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payout, setPayout] = useState<PayoutItem | null>(null);

  useEffect(() => {
    fetchPayoutDetails();
  }, [id]);

  const fetchPayoutDetails = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct getById, we fetch all and find
      // In a real app, we should have a specific endpoint
      const payouts = await scheduleService.getPayouts();
      const found = payouts.find(p => p.id === id);
      setPayout(found || null);
    } catch (error) {
      console.error("Failed to fetch payout details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={DefaultColors.primary} />
      </SafeAreaView>
    );
  }

  if (!payout) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={{ color: "white" }}>Payout not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: DefaultColors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getDaysRemaining = () => {
    if (!payout) return 0;
    const today = new Date();
    const unlockDate = new Date(payout.unlockDate);
    const diff = unlockDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusIcon = () => {
    switch (payout.status) {
      case "locked":
        return <Lock size={32} color={DefaultColors.white} />;
      case "unlocked":
        return <Unlock size={32} color={DefaultColors.white} />; // Changed icon
      case "pending":
        return <Clock size={32} color={DefaultColors.white} />;
    }
  };

  const handleCompletePayout = async () => {
    if (payout.status !== "locked") return;

    try {
      setLoading(true);
      await scheduleService.completePayout(payout.id, payout.type);
      Alert.alert("Success", "Payout completed successfully! Funds moved to balance.");
      fetchPayoutDetails();
    } catch (error: any) {
      console.error("Failed to complete payout:", error);
      Alert.alert("Error", error.message || "Failed to complete payout.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    // ... existing getStatusColor ...
    switch (payout.status) {
      case "locked": return "#EF4444";
      case "unlocked": return "#22C55E";
      case "pending": return "#F59E0B";
      default: return "#888";
    }
  };

  // Calculate generic progress based on dates (mock logic if lockDate is missing or just use time)
  // Assuming lockDate is available. If not, default to 0.
  const calculateProgress = () => {
    const start = new Date(payout.lockDate).getTime();
    const end = new Date(payout.unlockDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const current = now - start;
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    return Math.round(percentage);
  };

  const progress = calculateProgress();

  // Mock breakdown for visual "richness" as requested
  const processingFee = payout.amount * 0.01; // 1% fee
  const netPayout = payout.amount - processingFee;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={DefaultColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payout Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor()}20` }]}>
              {getStatusIcon()}
            </View>
            <Text style={styles.statusTitle}>{payout.title || payout.interval}</Text>
            <Text style={styles.statusSubtitle}>
              {payout.recurrence} • {payout.status === "locked"
                ? `${getDaysRemaining()} days remaining`
                : payout.status === "unlocked"
                  ? "Ready for withdrawal"
                  : "Processing"}
            </Text>

            {/* Amount Display */}
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>₦</Text>
              <Text style={styles.amount}>{formatMoney(payout.amount)}</Text>
            </View>

            {/* Progress Bar */}
            {payout.status === "locked" && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%`, backgroundColor: getStatusColor() }
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>{progress}% Complete</Text>
                  <Text style={styles.progressText}>{getDaysRemaining()} days left</Text>
                </View>
              </View>
            )}
          </View>

          {/* Breakdown Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Payout Breakdown</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Text style={styles.detailLabelText}>Scheduled Amount</Text>
              </View>
              <Text style={styles.detailValue}>₦{formatMoney(payout.amount)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Text style={styles.detailLabelText}>Processing Fee (1%)</Text>
              </View>
              <Text style={[styles.detailValue, { color: '#EF4444' }]}>- ₦{formatMoney(processingFee)}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomWidth: 0, marginTop: 8 }]}>
              <View style={styles.detailLabel}>
                <Text style={[styles.detailLabelText, { color: 'white', fontWeight: '700' }]}>Net Payout</Text>
              </View>
              <Text style={[styles.detailValue, { fontSize: 18, color: DefaultColors.primary }]}>₦{formatMoney(netPayout)}</Text>
            </View>
          </View>

          {/* Information Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Schedule Information</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Calendar size={18} color="#888" />
                <Text style={styles.detailLabelText}>Lock Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {new Date(payout.lockDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailRow}
              onPress={handleCompletePayout}
              disabled={payout.status !== "locked"}
            >
              <View style={styles.detailLabel}>
                <Unlock size={18} color="#888" />
                <Text style={styles.detailLabelText}>Unlock Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {new Date(payout.unlockDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </Text>
            </TouchableOpacity>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Clock size={18} color="#888" />
                <Text style={styles.detailLabelText}>Recurrence</Text>
              </View>
              <Text style={styles.detailValue}>{payout.recurrence}</Text>
            </View>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <View style={styles.detailLabel}>
                <Lock size={18} color="#888" />
                <Text style={styles.detailLabelText}>Current Status</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
                  {payout.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          {payout.status === "unlocked" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/(payout)/withdraw")}
            >
              <Text style={styles.actionButtonText}>Withdraw Funds</Text>
              <ArrowUpRight size={20} color={DefaultColors.black} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  currency: {
    fontSize: 24,
    color: "#888",
    fontWeight: "600",
    marginTop: 8,
    marginRight: 4,
  },
  amount: {
    fontSize: 48,
    fontWeight: "700",
    color: DefaultColors.white,
    letterSpacing: -1,
  },
  progressContainer: {
    width: "100%",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  detailsSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabelText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: DefaultColors.white,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  actionButton: {
    backgroundColor: DefaultColors.white,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.black,
  },
});