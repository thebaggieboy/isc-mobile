import Button from "@/components/Button";
import CreateWithdrawSchedule from "@/components/WithdrawSchedule";
import { DefaultColors } from "@/constants/colors";
import { scheduleService } from "@/services/api/schedule.service";
import Toast from 'react-native-toast-message';
import { notifyScheduleCreated } from '@/services/notifications';
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Schedule() {
  const router = useRouter();
  const [scheduleState, setScheduleState] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const mapFrequencyToString = (freq: number) => {
    switch (freq) {
      case 1: return 'monthly';
      case 2: return 'weekly';
      case 3: return 'daily';
      default: return 'once';
    }
  };

  const handleCreateSchedule = async () => {
    if (!scheduleState || !scheduleState.validation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Schedule',
        text2: 'Please ensure all fields are valid',
      });
      return;
    }

    try {
      setLoading(true);
      await scheduleService.createSchedule({
        title: scheduleState.title || "Withdrawal Schedule",
        amount: scheduleState.amount,
        payoutAmount: scheduleState.payoutAmount,
        scheduledDate: new Date(scheduleState.schedule.dtStart),
        recurrence: `${mapFrequencyToString(scheduleState.schedule.freq)};until=${new Date(scheduleState.schedule.until).toISOString()}`
      });

      Toast.show({
        type: 'success',
        text1: 'Schedule Created! 🎉',
        text2: 'Your withdrawal schedule has been set successfully.',
        visibilityTime: 4000,
      });

      // Fire local notification
      await notifyScheduleCreated(
        scheduleState.title || 'Withdrawal Schedule',
        scheduleState.amount
      );

      router.back();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      Toast.show({
        type: 'error',
        text1: 'Creation Failed',
        text2: 'Failed to create schedule. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={DefaultColors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Withdraw Schedule</Text>
            <Text style={styles.subtitle}>Manage your withdrawal schedule</Text>
          </View>
        </View>

        <CreateWithdrawSchedule
          onScheduleChange={setScheduleState}
        />

        <Button
          title={loading ? "Creating..." : "Create Schedule"}
          buttonStyle={[styles.createButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleCreateSchedule}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: DefaultColors.white,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: DefaultColors.white,
    opacity: 0.7,
    marginTop: 4,
  },
  createButton: {
    marginTop: 30,
    backgroundColor: "#DC2626",
    paddingVertical: 18,
    borderRadius: 16,
  },
});
