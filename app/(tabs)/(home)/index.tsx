import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';
import Balance from "@/components/Balance";
import UpcomingCard from "@/components/Upcomingcard";
import ImpulseControl from "@/components/ImpulseControl";
import { DefaultColors } from "@/constants/colors";
import { userService, UserProfile, UserBalance } from "@/services/api/user.service";
import { scheduleService } from "@/services/api/schedule.service";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";



export default function Home() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);


  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );



  const fetchUserData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      // Fetch all user data in parallel
      const [userData, balanceData, schedulesData, payoutsData] = await Promise.all([
        userService.getCurrentUser(),
        userService.getBalance(),
        scheduleService.getSchedules(),
        scheduleService.getPayouts(),
      ]);

      setUser(userData);
      setBalance(balanceData);

      setSchedules(schedulesData);
      setPayouts(payoutsData);

      // Check for new user and KYC status
      handleWelcomeToast(userData);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWelcomeToast = (userData: UserProfile) => {
    // Check if user was created in the last 5 minutes
    const createdAt = new Date(userData.createdAt).getTime();
    const now = new Date().getTime();
    const isNewUser = (now - createdAt) < 5 * 60 * 1000;

    if (isNewUser) {
      Toast.show({
        type: 'success',
        text1: 'Welcome to SaveGuard! 🚀',
        text2: 'Your journey to financial freedom starts here.',
        visibilityTime: 4000,
      });
    }

    // Check KYC Status
    // We use a slight delay to not overlap toasts found if user is new
    setTimeout(() => {
      if (userData.kycStatus === 'pending' || userData.kycStatus === 'unverified') {
        Toast.show({
          type: 'info',
          text1: 'Complete Verification 🛡️',
          text2: 'Verify your identity to unlock full features.',
          visibilityTime: 5000,
        });
      } else if (userData.kycStatus === 'verified' && isNewUser) {
        Toast.show({
          type: 'success',
          text1: 'Account Verified ✅',
          text2: 'You are all set to save and withdraw!',
        });
      }
    }, isNewUser ? 4500 : 1000);
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

  // Filter schedules: show as upcoming until their date has passed
  const upcomingSchedules = schedules.filter((s) => {
    if (s.status === 'completed') return false;
    const schedDate = new Date(s.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    schedDate.setHours(0, 0, 0, 0);
    return schedDate >= today;
  });

  // ── Calculate stats from schedules & payouts ──────────────
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Lock count: payouts with "locked" status
  const lockCount = payouts.filter(p => p.status === 'locked').length;

  // Total locked amount from payouts
  const totalLocked = payouts
    .filter(p => p.status === 'locked')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // Locked this month: payouts locked within the current calendar month
  const lockedThisMonth = payouts
    .filter((p: any) => {
      const lockDate = new Date(p.lockDate);
      return lockDate.getMonth() === currentMonth && lockDate.getFullYear() === currentYear;
    })
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  // Active schedules: non-completed schedules
  const activeSchedules = schedules.filter(s => s.status !== 'completed').length;

  // Completed payouts
  const completedPayouts = payouts.filter((p: any) => p.status === 'unlocked' || p.status === 'completed').length;

  // Total balance (available + locked)
  const totalBalance = userBalance + totalLocked;

  // Streak: days since ccount creation (or days with active locks)
  const accountCreated = user?.createdAt ? new Date(user.createdAt) : now;
  const streakDays = Math.max(0, Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)));

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
            totalLocked={totalLocked}
            lockedThisMonth={lockedThisMonth}
            lockCount={lockCount}
            activeSchedules={activeSchedules}
            completedPayouts={completedPayouts}
            totalBalance={totalBalance}
            streakDays={streakDays}
          />

          <UpcomingCard
            schedules={upcomingSchedules}
            payouts={payouts}
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
    color: '#ccc',
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
    color: '#EF4444',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 16,
    color: DefaultColors.primary,
    fontWeight: '600',
  },
});