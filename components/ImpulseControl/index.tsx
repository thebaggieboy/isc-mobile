import { useEffect, useRef } from "react";
import { DefaultColors } from "@/constants/colors";
import {
  Shield,
  TrendingUp,
  Flame,
  Target,
  Lock,
  Calendar,
  Wallet,
  Award
} from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from "react-native";
import { formatMoney } from "@/utils/amount";

interface ImpulseControlProps {
  totalLocked: number;
  lockedThisMonth: number;
  lockCount: number;
  activeSchedules: number;
  completedPayouts: number;
  totalBalance: number;
  streakDays: number;
}

export default function ImpulseControl({
  totalLocked,
  lockedThisMonth,
  lockCount,
  activeSchedules,
  completedPayouts,
  totalBalance,
  streakDays,
}: ImpulseControlProps) {
  // Animation values
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Progress: how much of total balance is locked (discipline score)
  const disciplineScore = totalBalance > 0
    ? Math.min((totalLocked / totalBalance) * 100, 100)
    : 0;

  return (
    <Animated.View style={[styles.container, {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shieldIcon}>
            <Shield size={20} color="#ff4444" />
          </View>
          <View>
            <Text style={styles.title}>Savings Overview</Text>
            <Text style={styles.subtitle}>Your financial discipline at a glance</Text>
          </View>
        </View>
      </View>

      {/* Locked Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Lock Discipline</Text>
          <Text style={styles.progressAmount}>
            ₦{formatMoney(totalLocked)} locked
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${disciplineScore}%` }
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {disciplineScore.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Top Stats Row */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Lock size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>{lockCount}</Text>
          <Text style={styles.statLabel}>Active{'\n'}Locks</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <TrendingUp size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>
            ₦{lockedThisMonth >= 1000 ? `${formatMoney(Math.round(lockedThisMonth / 1000))}k` : formatMoney(lockedThisMonth)}
          </Text>
          <Text style={styles.statLabel}>Locked{'\n'}This Month</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Calendar size={18} color="#ff4444" />
          </View>
          <Text style={styles.statValue}>{activeSchedules}</Text>
          <Text style={styles.statLabel}>Active{'\n'}Schedules</Text>
        </View>
      </View>

      {/* Bottom Stats Row */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#22C55E10' }]}>
            <Wallet size={18} color="#22C55E" />
          </View>
          <Text style={styles.statValue}>{completedPayouts}</Text>
          <Text style={styles.statLabel}>Completed{'\n'}Payouts</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B10' }]}>
            <Flame size={18} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>{streakDays}</Text>
          <Text style={styles.statLabel}>Day{'\n'}Streak</Text>
        </View>
      </View>

      {/* Achievement Badge */}
      {
        lockCount >= 3 && (
          <View style={styles.achievementBanner}>
            <View style={styles.achievementLeft}>
              <Award size={20} color="#ff4444" />
              <View>
                <Text style={styles.achievementTitle}>
                  {lockCount >= 10 ? "🏆 Lock Master!" : lockCount >= 5 ? "🔥 Discipline Pro!" : "🎯 Getting Started!"}
                </Text>
                <Text style={styles.achievementText}>
                  {lockCount >= 10
                    ? `${lockCount} locks active — incredible discipline`
                    : lockCount >= 5
                      ? `${lockCount} locks active — you're on fire`
                      : `${lockCount} locks active — keep going`}
                </Text>
              </View>
            </View>
          </View>
        )
      }
    </Animated.View >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DefaultColors.black,
    borderRadius: 0,
    padding: 20,
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
    fontSize: 18,
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