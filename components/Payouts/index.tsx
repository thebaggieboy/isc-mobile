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
  Search,
  ArrowUpRight
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

import { PayoutItem } from "@/services/api/schedule.service";

interface PayoutProps {
  totalLocked: number;
  upcomingPayout: number;
  payoutDate: Date | null;
  payouts: PayoutItem[];
  balance?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function Payout({
  totalLocked,
  upcomingPayout,
  payoutDate,
  payouts,
  balance = 0,
  onRefresh,
  refreshing = false
}: PayoutProps) {
  const router = useRouter();
  const [showAmounts, setShowAmounts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "locked" | "unlocked" | "pending" | "completed">("all");

  const getDaysUntilPayout = () => {
    if (!payoutDate) return 0;
    const today = new Date();
    const diff = payoutDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock size={16} color="#888" />;
      case "unlocked":
      case "completed":
        return <CheckCircle size={16} color="#4CAF50" />;
      case "pending":
        return <Clock size={16} color="#FFC107" />;
      default:
        return <AlertCircle size={16} color="#888" />;
    }
  };

  const filteredPayouts = payouts
    .filter(p => filterStatus === "all" || p.status === filterStatus)
    .filter(p => searchQuery === "" || (p.title || p.interval).toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={DefaultColors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.payoutView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Your Payouts</Text>
            <Text style={styles.subtitle}>
              Manage your withdrawal schedules
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
              <Text style={styles.cardLabel}>Total Payout</Text>
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
            {upcomingPayout > 0 && (
              <View style={styles.countdownContainer}>
                <Calendar size={12} color="#888" />
                <Text style={styles.countdownText}>
                  in {getDaysUntilPayout()} days
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions - Withdrawal */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => router.push("/(tabs)/(payout)/withdraw")}
          >
            <ArrowUpRight size={20} color={DefaultColors.white} />
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
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
          {["all", "locked", "pending", "unlocked", "completed"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text style={[styles.filterChipText, filterStatus === status && styles.filterChipTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
              onPress={() => router.push(`/(tabs)/(payout)/${payout.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.payoutCardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: payout.status === 'unlocked' || payout.status === 'completed' ? '#4CAF5020' : '#222' }]}>
                  {getStatusIcon(payout.status)}
                </View>
                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutInterval}>{payout.title || payout.interval}</Text>
                  <Text style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>{payout.recurrence}</Text>
                  <Text style={styles.payoutDate}>
                    {payout.status === "locked"
                      ? `Unlocks ${new Date(payout.unlockDate).toLocaleDateString()}`
                      : payout.status === "completed"
                        ? `Completed ${new Date(payout.unlockDate).toLocaleDateString()}`
                        : `Unlocked ${new Date(payout.unlockDate).toLocaleDateString()}`
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.payoutCardRight}>
                <Text style={[styles.payoutAmount, { color: payout.status === 'unlocked' || payout.status === 'completed' ? '#4CAF50' : DefaultColors.white }]}>
                  {showAmounts ? `₦${formatMoney(payout.amount)}` : "****"}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: payout.status === 'unlocked' || payout.status === 'completed' ? '#4CAF5020' :
                    payout.status === 'pending' ? '#FFC10720' : '#333'
                }]}>
                  <Text style={[styles.statusText, {
                    color: payout.status === 'unlocked' || payout.status === 'completed' ? '#4CAF50' :
                      payout.status === 'pending' ? '#FFC107' : '#888'
                  }]}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
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
                  : "Create a schedule to start receiving payouts"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}