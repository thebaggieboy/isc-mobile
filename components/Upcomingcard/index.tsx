import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  Lock
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { formatMoney } from "@/utils/amount";

interface ScheduleItem {
  id: string;
  title: string;
  date: Date;
  amount: number;
}

interface PayoutItem {
  id: string;
  interval: string;
  unlockDate: Date;
  amount: number;
}

interface UpcomingCardProps {
  schedules: ScheduleItem[];
  payouts: PayoutItem[];
}

export default function UpcomingCard({ schedules, payouts }: UpcomingCardProps) {
  const router = useRouter();

  const getRelativeDate = (date: Date) => {
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 7) return `${diff} days`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Upcoming Schedules Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Calendar size={18} color={DefaultColors.white} />
            <Text style={styles.sectionTitle}>Upcoming Schedules</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push("/schedule")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsContainer}>
          {schedules.length > 0 ? (
            schedules.slice(0, 2).map((schedule) => (
              <TouchableOpacity 
                key={schedule.id}
                style={styles.item}
                onPress={() => router.push(`/schedule/${schedule.id}`)}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.itemIconContainer}>
                    <Clock size={16} color="#888" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{schedule.title}</Text>
                    <Text style={styles.itemDate}>
                      {getRelativeDate(schedule.date)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemAmount}>
                  ₦{formatMoney(schedule.amount)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={32} color="#888" />
              <Text style={styles.emptyText}>No upcoming schedules</Text>
            </View>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Upcoming Payouts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <TrendingUp size={18} color={DefaultColors.white} />
            <Text style={styles.sectionTitle}>Upcoming Payouts</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push("/payout")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsContainer}>
          {payouts.length > 0 ? (
            payouts.slice(0, 2).map((payout) => (
              <TouchableOpacity 
                key={payout.id}
                style={styles.item}
                onPress={() => router.push(`/payout/${payout.id}`)}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.itemIconContainer}>
                    <Lock size={16} color="#888" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{payout.interval}</Text>
                    <Text style={styles.itemDate}>
                      {getRelativeDate(payout.unlockDate)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemAmount}>
                  ₦{formatMoney(payout.amount)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Lock size={32} color="#888" />
              <Text style={styles.emptyText}>No upcoming payouts</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 20,
  },
  section: {
    marginBottom: 4,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
  },
  itemsContainer: {
    gap: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
    marginVertical: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
});