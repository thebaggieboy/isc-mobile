import { useLocalSearchParams, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import {
  Lock,
  Unlock,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CalendarCheck,
  Target,
  Info
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
import { userService, UserBalance } from "@/services/api/user.service";

export default function PayoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payout, setPayout] = useState<PayoutItem | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);

  useEffect(() => {
    fetchPayoutDetails();
  }, [id]);

  const fetchPayoutDetails = async () => {
    try {
      setLoading(true);
      const [payouts, balanceData] = await Promise.all([
        scheduleService.getPayouts(),
        userService.getBalance(),
      ]);
      const found = payouts.find(p => p.id === id);
      setPayout(found || null);
      setBalance(balanceData);
    } catch (error) {
      console.error("Failed to fetch payout details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayout = async () => {
    if (!payout || payout.status !== "locked") return;

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

  const getStatusColor = () => {
    switch (payout.status) {
      case "locked": return "#EF4444";
      case "unlocked": return "#22C55E";
      case "completed": return "#22C55E";
      case "pending": return "#F59E0B";
      default: return "#888";
    }
  };

  const getStatusIcon = () => {
    switch (payout.status) {
      case "locked":
        return <Lock size={32} color={getStatusColor()} />;
      case "unlocked":
      case "completed":
        return <Unlock size={32} color={getStatusColor()} />;
      case "pending":
        return <Clock size={32} color={getStatusColor()} />;
      default:
        return <Lock size={32} color="#888" />;
    }
  };

  // Calculate days remaining
  const unlockDate = new Date(payout.unlockDate);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isCompleted = payout.status === "unlocked" || payout.status === "completed";
  const isPast = unlockDate <= now;

  // Progress based on lock → unlock dates
  const calculateProgress = () => {
    const start = new Date(payout.lockDate).getTime();
    const end = new Date(payout.unlockDate).getTime();
    const current = new Date().getTime();
    const total = end - start;
    if (total <= 0) return 100;
    return Math.round(Math.min(100, Math.max(0, ((current - start) / total) * 100)));
  };
  const progress = calculateProgress();

  // Balance info
  const currentBalance = balance?.balance || 0;
  const totalLocked = balance?.totalLocked || 0;
  const projectedBalance = isCompleted ? currentBalance : currentBalance + payout.amount;

  // Format date nicely
  const formatDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
            <View style={styles.statusBadgeRow}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
                  {payout.status}
                </Text>
              </View>
              <Text style={styles.recurrenceText}>{payout.recurrence}</Text>
            </View>

            {/* Amount Display */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Payout Amount</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currency}>₦</Text>
                <Text style={styles.amount}>{formatMoney(payout.amount)}</Text>
              </View>
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
                  <Text style={styles.progressText}>{daysRemaining} days left</Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Stats Row */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <Lock size={18} color="#3B82F6" />
              <Text style={styles.quickStatValue}>₦{formatMoney(totalLocked)}</Text>
              <Text style={styles.quickStatLabel}>Total Locked</Text>
            </View>
            <View style={styles.quickStatCard}>
              <CalendarCheck size={18} color={isCompleted || isPast ? "#22C55E" : "#F59E0B"} />
              <Text style={styles.quickStatValue}>
                {isCompleted ? "Done" : isPast ? "Due" : `${daysRemaining}d`}
              </Text>
              <Text style={styles.quickStatLabel}>
                {isCompleted ? "Completed" : isPast ? "Overdue" : "Remaining"}
              </Text>
            </View>
            <View style={styles.quickStatCard}>
              <Wallet size={18} color="#22C55E" />
              <Text style={styles.quickStatValue}>₦{formatMoney(projectedBalance)}</Text>
              <Text style={styles.quickStatLabel}>After Payout</Text>
            </View>
          </View>

          {/* Breakdown Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Payout Breakdown</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Info size={16} color="#888" />
                <Text style={styles.detailLabelText}>Scheduled Amount</Text>
              </View>
              <Text style={styles.detailValue}>₦{formatMoney(payout.amount)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Target size={16} color="#888" />
                <Text style={styles.detailLabelText}>Type</Text>
              </View>
              <View style={[styles.typeBadge, {
                backgroundColor: payout.type === 'lock' ? '#3B82F620' : '#F59E0B20'
              }]}>
                <Text style={[styles.typeBadgeText, {
                  color: payout.type === 'lock' ? '#3B82F6' : '#F59E0B'
                }]}>
                  {payout.type === 'lock' ? 'Lock Period' : 'Schedule'}
                </Text>
              </View>
            </View>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <View style={styles.detailLabel}>
                <Clock size={16} color="#888" />
                <Text style={styles.detailLabelText}>Recurrence</Text>
              </View>
              <Text style={styles.detailValue}>{payout.recurrence}</Text>
            </View>
          </View>

          {/* Timing Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Schedule Timing</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Calendar size={16} color="#888" />
                <Text style={styles.detailLabelText}>Lock Date</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(payout.lockDate)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <CalendarCheck size={16} color="#888" />
                <Text style={styles.detailLabelText}>Ends On</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(payout.unlockDate)}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Clock size={16} color="#888" />
                <Text style={styles.detailLabelText}>
                  {isCompleted ? "Status" : isPast ? "Overdue By" : "Time Left"}
                </Text>
              </View>
              <Text style={[styles.detailValue, {
                color: isCompleted ? "#22C55E" : isPast ? "#EF4444" : DefaultColors.white
              }]}>
                {isCompleted
                  ? "Payout processed"
                  : isPast
                    ? `${Math.abs(daysRemaining)} days ago`
                    : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
              </Text>
            </View>

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <View style={styles.detailLabel}>
                <Lock size={16} color="#888" />
                <Text style={styles.detailLabelText}>Current Status</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
                  {payout.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Projected Balance Card */}
          <View style={styles.projectedCard}>
            <View style={styles.projectedHeader}>
              <ArrowDownRight size={20} color="#22C55E" />
              <Text style={styles.projectedTitle}>
                {isCompleted ? "Balance After Payout" : "Projected Balance After Payout"}
              </Text>
            </View>
            <View style={styles.projectedRow}>
              <View>
                <Text style={styles.projectedLabel}>Current Balance</Text>
                <Text style={styles.projectedValue}>₦{formatMoney(currentBalance)}</Text>
              </View>
              <View style={styles.projectedDivider} />
              <View>
                <Text style={styles.projectedLabel}>
                  {isCompleted ? "After Payout" : "After Completion"}
                </Text>
                <Text style={[styles.projectedValue, { color: "#22C55E" }]}>
                  ₦{formatMoney(projectedBalance)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {payout.status === "locked" && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompletePayout}
            >
              <Text style={styles.completeButtonText}>Complete Payout</Text>
            </TouchableOpacity>
          )}

          {payout.status === "unlocked" && (
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => router.push("/(tabs)/(payout)/withdraw")}
            >
              <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
              <ArrowUpRight size={20} color={DefaultColors.black} />
            </TouchableOpacity>
          )}

          {/* Info Card */}
          <View style={styles.instructionCard}>
            <Info size={20} color={DefaultColors.primary} />
            <Text style={styles.instructionText}>
              {isCompleted
                ? "This payout has been completed and the funds are available in your balance for withdrawal."
                : "Your funds will be automatically processed on the unlock date and moved to your available balance for withdrawal."}
            </Text>
          </View>
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
    gap: 20,
    paddingBottom: 40,
  },
  // Status Card
  statusCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
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
    fontSize: 22,
    fontWeight: "700",
    color: DefaultColors.white,
    marginBottom: 8,
    textAlign: "center",
  },
  statusBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  recurrenceText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  amountContainer: {
    width: "100%",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currency: {
    fontSize: 20,
    color: "#888",
    fontWeight: "600",
    marginTop: 6,
    marginRight: 4,
  },
  amount: {
    fontSize: 40,
    fontWeight: "700",
    color: "white",
  },
  // Progress
  progressContainer: {
    width: "100%",
    marginTop: 24,
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
  // Quick Stats
  quickStatsRow: {
    flexDirection: "row",
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  quickStatLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
    textAlign: "center",
  },
  // Details
  detailsSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 24,
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailLabelText: {
    fontSize: 14,
    color: "#888",
  },
  detailValue: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Projected Balance
  projectedCard: {
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.15)",
    gap: 16,
  },
  projectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  projectedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  projectedRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  projectedLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textAlign: "center",
  },
  projectedValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  projectedDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  // Buttons
  completeButton: {
    backgroundColor: DefaultColors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  withdrawButton: {
    backgroundColor: DefaultColors.white,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.black,
  },
  // Instruction
  instructionCard: {
    flexDirection: "row",
    backgroundColor: "rgba(220, 38, 38, 0.05)",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
});