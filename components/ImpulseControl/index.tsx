import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  Shield,
  TrendingUp,
  Flame,
  Target,
  Award
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { formatMoney } from "@/utils/amount";

interface ImpulseControlProps {
  savedThisMonth: number;
  impulsesStopped: number;
  currentStreak: number;
  savingsGoal: number;
}

export default function ImpulseControl({ 
  savedThisMonth,
  impulsesStopped,
  currentStreak,
  savingsGoal
}: ImpulseControlProps) {
  const router = useRouter();

  const progressPercentage = Math.min((savedThisMonth / savingsGoal) * 100, 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shieldIcon}>
            <Shield size={20} color="#ff4444" />
          </View>
          <View>
            <Text style={styles.title}>Impulse Control</Text>
            <Text style={styles.subtitle}>Stay on track with your goals</Text>
          </View>
        </View>
      </View>

      {/* Savings Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Monthly Savings Goal</Text>
          <Text style={styles.progressAmount}>
            ₦{formatMoney(savedThisMonth)} / ₦{formatMoney(savingsGoal)}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {progressPercentage.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Impulses Stopped */}
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Target size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>{impulsesStopped}</Text>
          <Text style={styles.statLabel}>Impulses{'\n'}Stopped</Text>
        </View>

        {/* Current Streak */}
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Flame size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day{'\n'}Streak</Text>
        </View>

        {/* Money Saved */}
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <TrendingUp size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>
            ₦{formatMoney(savedThisMonth / 1000)}k
          </Text>
          <Text style={styles.statLabel}>This{'\n'}Month</Text>
        </View>
      </View>

      {/* Achievement Badge */}
      {currentStreak >= 7 && (
        <TouchableOpacity 
          style={styles.achievementBanner}
          onPress={() => router.push("/achievements")}
        >
          <View style={styles.achievementLeft}>
            <Award size={20} color="#ff4444" />
            <View>
              <Text style={styles.achievementTitle}>Week Warrior! 🎉</Text>
              <Text style={styles.achievementText}>
                You've stayed strong for {currentStreak} days
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  progressSection: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
  },
  progressAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#222",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ff4444",
    width: 40,
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
    lineHeight: 14,
  },
  achievementBanner: {
    backgroundColor: "#ff444410",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ff444420",
  },
  achievementLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: DefaultColors.white,
    marginBottom: 2,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
  },
});