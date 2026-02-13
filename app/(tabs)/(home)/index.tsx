import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Balance from "@/components/Balance";
import UpcomingCard from "@/components/Upcomingcard";
import ImpulseControl from "@/components/ImpulseControl";
import { DefaultColors } from "@/constants/colors";
import { userService, UserProfile, UserBalance, UserStats } from "@/services/api/user.service";

// Mock data for schedules (replace with actual API call later)
const mockSchedules = [
  {
    id: "1",
    title: "Monthly Savings",
    date: new Date(2026, 1, 1), // Feb 1, 2026
    amount: 50000,
  },
  {
    id: "2",
    title: "Rent Payment",
    date: new Date(2026, 1, 5), // Feb 5, 2026
    amount: 150000,
  },
];

// Mock data for payouts (replace with actual API call later)
const mockPayouts = [
  {
    id: "1",
    interval: "30 Day Lock",
    unlockDate: new Date(2026, 1, 15), // Feb 15, 2026
    amount: 75000,
  },
  {
    id: "2",
    interval: "14 Day Lock",
    unlockDate: new Date(2026, 1, 20), // Feb 20, 2026
    amount: 45000,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      // Fetch all user data in parallel
      const [userData, balanceData, statsData] = await Promise.all([
        userService.getCurrentUser(),
        userService.getBalance(),
        userService.getStats(),
      ]);

      setUser(userData);
      setBalance(balanceData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData(true);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DefaultColors.primary} />
          <Text style={styles.loadingText}>Loading your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => fetchUserData()}>
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Extract user name (from fullName or email)
  const userName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const userBalance = balance?.balance || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={DefaultColors.primary}
            colors={[DefaultColors.primary]}
          />
        }
      >
        <View style={styles.HomeView}>
          <Balance userName={userName} balance={userBalance} />
          
          <ImpulseControl
            savedThisMonth={stats?.savedThisMonth || 0}
            impulsesStopped={stats?.impulsesStopped || 0}
            currentStreak={stats?.currentStreak || 0}
            savingsGoal={stats?.savingsGoal || 0}
          />
          
          <UpcomingCard 
            schedules={mockSchedules}
            payouts={mockPayouts}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  scrollView: {
    flex: 1,
  },
  HomeView: {
    padding: 0,
    gap: 0,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: DefaultColors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: DefaultColors.error || '#ff0000',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: DefaultColors.primary,
    fontWeight: '600',
  },
});