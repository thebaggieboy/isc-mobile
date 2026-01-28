import { useLocalSearchParams, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  Lock, 
  Unlock, 
  Calendar, 
  Clock,
  CheckCircle,
  ArrowLeft
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/amount";

export default function PayoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data - replace with actual data fetch based on id
  const payoutDetail = {
    id: id as string,
    amount: 50000,
    lockDate: new Date("2026-01-15"),
    unlockDate: new Date("2026-02-15"),
    status: "locked" as const,
    interval: "30 Day Lock",
    description: "Locked for 30 days to help with impulse control",
    progress: 45, // percentage
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const diff = payoutDetail.unlockDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusIcon = () => {
    switch (payoutDetail.status) {
      case "locked":
        return <Lock size={32} color={DefaultColors.white} />;
      case "unlocked":
        return <CheckCircle size={32} color={DefaultColors.white} />;
      case "pending":
        return <Clock size={32} color={DefaultColors.white} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.iconContainer}>
              {getStatusIcon()}
            </View>
            <Text style={styles.statusTitle}>{payoutDetail.interval}</Text>
            <Text style={styles.statusSubtitle}>
              {payoutDetail.status === "locked" 
                ? `${getDaysRemaining()} days remaining`
                : payoutDetail.status === "unlocked"
                ? "Completed"
                : "Processing"}
            </Text>

            {/* Amount Display */}
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>₦</Text>
              <Text style={styles.amount}>{formatMoney(payoutDetail.amount)}</Text>
            </View>

            {/* Progress Bar */}
            {payoutDetail.status === "locked" && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${payoutDetail.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{payoutDetail.progress}% Complete</Text>
              </View>
            )}
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Calendar size={16} color="#888" />
                <Text style={styles.detailLabelText}>Lock Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {payoutDetail.lockDate.toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Unlock size={16} color="#888" />
                <Text style={styles.detailLabelText}>Unlock Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {payoutDetail.unlockDate.toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Lock size={16} color="#888" />
                <Text style={styles.detailLabelText}>Status</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {payoutDetail.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          {payoutDetail.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Note</Text>
              <Text style={styles.descriptionText}>
                {payoutDetail.description}
              </Text>
            </View>
          )}

          {/* Action Button */}
          {payoutDetail.status === "unlocked" && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Handle withdraw action
                router.back();
              }}
            >
              <Text style={styles.actionButtonText}>Withdraw Funds</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#222",
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
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: DefaultColors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  detailsSection: {
    backgroundColor: DefaultColors.black,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: DefaultColors.white,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  descriptionSection: {
    backgroundColor: DefaultColors.black,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: DefaultColors.white,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: DefaultColors.black,
  },
});