import { useRouter } from "expo-router";
import { styles } from "./styles";
import { DefaultColors } from "@/constants/colors";
import { 
  Lock, 
  Unlock, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from "lucide-react-native";
import { useState } from "react";
import { 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  RefreshControl,
  TextInput 
} from "react-native";
import { formatMoney } from "@/utils/amount";

interface PayoutItem {
  id: string;
  amount: number;
  lockDate: Date;
  unlockDate: Date;
  status: "locked" | "unlocked" | "pending";
  interval: string;
}

interface PayoutProps {
  totalLocked: number;
  upcomingPayout: number;
  payoutDate: Date;
  payouts: PayoutItem[];
  userName: string;
}

export default function Payout({ 
  totalLocked, 
  upcomingPayout, 
  payoutDate,
  payouts,
  userName 
}: PayoutProps) {
  const router = useRouter();
  const [showAmounts, setShowAmounts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "locked" | "unlocked" | "pending">("all");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getDaysUntilPayout = () => {
    const today = new Date();
    const diff = payoutDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock size={16} color="#888" />;
      case "unlocked":
        return <CheckCircle size={16} color={DefaultColors.white} />;
      case "pending":
        return <Clock size={16} color="#888" />;
      default:
        return <AlertCircle size={16} color="#888" />;
    }
  };

  const getTotalStats = () => {
    const locked = payouts.filter(p => p.status === "locked").reduce((sum, p) => sum + p.amount, 0);
    const count = payouts.length;
    const lockedCount = payouts.filter(p => p.status === "locked").length;
    return { locked, count, lockedCount };
  };

  const filteredPayouts = payouts
    .filter(p => filterStatus === "all" || p.status === filterStatus)
    .filter(p => searchQuery === "" || p.interval.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = getTotalStats();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.payoutView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Your Payouts</Text>
            <Text style={styles.subtitle}>
              {stats.count} total • {stats.lockedCount} locked
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAmounts(!showAmounts)}
            style={styles.eyeButton}
          >
            {showAmounts ? (
              <Unlock color={DefaultColors.white} size={20} />
            ) : (
              <Lock color={DefaultColors.white} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Lock size={16} color="#888" />
              <Text style={styles.cardLabel}>Total Locked</Text>
            </View>
            <View style={styles.cardAmount}>
              <Text style={styles.currency}>₦</Text>
              <Text style={styles.amount}>
                {showAmounts ? formatMoney(totalLocked) : "****"}
              </Text>
            </View>
          </View>

          <View style={[styles.summaryCard, styles.highlightCard]}>
            <View style={styles.cardHeader}>
              <TrendingUp size={16} color="#888" />
              <Text style={styles.cardLabel}>Next Payout</Text>
            </View>
            <View style={styles.cardAmount}>
              <Text style={styles.currency}>₦</Text>
              <Text style={styles.amount}>
                {showAmounts ? formatMoney(upcomingPayout) : "****"}
              </Text>
            </View>
            <View style={styles.countdownContainer}>
              <Calendar size={12} color="#888" />
              <Text style={styles.countdownText}>
                in {getDaysUntilPayout()} days
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search payouts..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChips}>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === "all" && styles.filterChipActive]}
            onPress={() => setFilterStatus("all")}
          >
            <Text style={[styles.filterChipText, filterStatus === "all" && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === "locked" && styles.filterChipActive]}
            onPress={() => setFilterStatus("locked")}
          >
            <Text style={[styles.filterChipText, filterStatus === "locked" && styles.filterChipTextActive]}>
              Locked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === "pending" && styles.filterChipActive]}
            onPress={() => setFilterStatus("pending")}
          >
            <Text style={[styles.filterChipText, filterStatus === "pending" && styles.filterChipTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterStatus === "unlocked" && styles.filterChipActive]}
            onPress={() => setFilterStatus("unlocked")}
          >
            <Text style={[styles.filterChipText, filterStatus === "unlocked" && styles.filterChipTextActive]}>
              Unlocked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payout History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>
            {filterStatus === "all" ? "All Payouts" : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Payouts`} ({filteredPayouts.length})
          </Text>
          
          {filteredPayouts.map((payout) => (
            <TouchableOpacity 
              key={payout.id}
              style={styles.payoutCard}
              onPress={() => router.push(`/payout/${payout.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.payoutCardLeft}>
                <View style={styles.iconContainer}>
                  {getStatusIcon(payout.status)}
                </View>
                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutInterval}>{payout.interval}</Text>
                  <Text style={styles.payoutDate}>
                    {payout.status === "locked" 
                      ? `Unlocks ${payout.unlockDate?.toLocaleDateString() || 'N/A'}`
                      : `Unlocked ${payout.unlockDate?.toLocaleDateString() || 'N/A'}`
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.payoutCardRight}>
                <Text style={styles.payoutAmount}>
                  {showAmounts ? `₦${formatMoney(payout.amount)}` : "****"}
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {payout.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredPayouts.length === 0 && (
            <View style={styles.emptyState}>
              <Lock size={48} color="#888" />
              <Text style={styles.emptyTitle}>No Payouts Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? "Try adjusting your search"
                  : "Lock funds to start receiving scheduled payouts"}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/lock-funds")}
          >
            <Lock size={18} color={DefaultColors.black} />
            <Text style={styles.actionButtonText}>Lock Funds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => router.push("/schedule")}
          >
            <Calendar size={18} color={DefaultColors.white} />
            <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
              View Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}