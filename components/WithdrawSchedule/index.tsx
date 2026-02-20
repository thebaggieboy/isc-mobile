import { DefaultColors } from "@/constants/colors";
import { PaymentFrequency } from "@/types/schema";
import { formatMoney } from "@/utils/amount";
import { formatDateToViewable } from "@/utils/time";
import { scheduleConfigToRRule } from "@/utils/withdrawSchedule";
import { AlertCircle, Calendar } from "lucide-react-native";
import { useCallback, useMemo, useReducer, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "../DatePicker";
import AmountInput from "./components/AmountInput";
import TitleInput from "./components/TitleInput";
import PayoutAmountInput from "./components/PayoutAmountInput";
import FrequencyPicker from "./components/FrequencyPicker";
import MonthDayPicker from "./components/MonthDayPicker";
import WeekdayPicker from "./components/WeekdayPicker";
import {
  createInitialState,
  scheduleActions,
  scheduleReducer,
  ScheduleState,
} from "./scheduleReducer";
import { styles } from "./styles";

interface CreateWithdrawScheduleProps {
  onScheduleChange?: (state: ScheduleState) => void;
  initialStartDate?: Date;
}

export default function CreateWithdrawSchedule({
  onScheduleChange,
  initialStartDate,
}: CreateWithdrawScheduleProps = {}) {
  const [state, dispatch] = useReducer(
    scheduleReducer,
    initialStartDate ?? new Date(),
    createInitialState,
  );

  const { schedule, amount, payoutAmount, validation } = state;

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useMemo(() => {
    onScheduleChange?.(state);
  }, [state, onScheduleChange]);

  const summary = useMemo(() => {
    if (!validation.isValid) {
      return null;
    }
    const rrule = scheduleConfigToRRule(schedule);
    return rrule.toText();
  }, [schedule, validation.isValid]);

  const handleFrequencyChange = useCallback((freq: PaymentFrequency) => {
    dispatch(scheduleActions.setFrequency(freq));
  }, []);

  const handleIntervalChange = useCallback((interval: number) => {
    dispatch(scheduleActions.setInterval(interval));
  }, []);

  const handleToggleWeekday = useCallback((dayIndex: number) => {
    dispatch(scheduleActions.toggleWeekday(dayIndex));
  }, []);

  const handleMonthDayChange = useCallback((day: number) => {
    dispatch(scheduleActions.setMonthDay(day));
  }, []);

  const handleAmountChange = useCallback((newAmount: number) => {
    dispatch(scheduleActions.setAmount(newAmount));
  }, []);

  const handleTitleChange = useCallback((newTitle: string) => {
    dispatch(scheduleActions.setTitle(newTitle));
  }, []);

  const handlePayoutAmountChange = useCallback((newAmount: number) => {
    dispatch(scheduleActions.setPayoutAmount(newAmount));
  }, []);

  const handleStartDateChange = useCallback((date: number) => {
    dispatch(scheduleActions.setStartDate(date));
    setShowStartDatePicker(false);
  }, []);

  const handleEndDateChange = useCallback((date: number) => {
    dispatch(scheduleActions.setEndDate(date));
    setShowEndDatePicker(false);
  }, []);

  return (
    <View style={styles.container}>
      <TitleInput
        title={state.title}
        onTitleChange={handleTitleChange}
      />

      <View style={styles.autoPayoutContainer}>
        <View style={styles.autoPayoutTextContent}>
          <Text style={styles.autoPayoutTitle}>Automatic Payout</Text>
          <Text style={styles.autoPayoutSubtitle}>Transfer to default bank when due</Text>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(scheduleActions.setAutoPayout(!state.autoPayout))}
          style={[styles.toggleButton, { backgroundColor: state.autoPayout ? '#DC2626' : '#333' }]}>
          <View style={[styles.toggleKnob, { alignSelf: state.autoPayout ? 'flex-end' : 'flex-start' }]} />
        </TouchableOpacity>
      </View>

      <AmountInput
        amount={amount}
        onAmountChange={handleAmountChange}
      />

      <PayoutAmountInput
        amount={payoutAmount}
        onAmountChange={handlePayoutAmountChange}
      />

      <FrequencyPicker
        frequency={schedule.freq}
        interval={schedule.interval}
        onFrequencyChange={handleFrequencyChange}
        onIntervalChange={handleIntervalChange}
      />

      {schedule.freq === PaymentFrequency.WEEKLY && schedule.byWeekday && (
        <WeekdayPicker
          selectedWeekdays={schedule.byWeekday}
          onToggleWeekday={handleToggleWeekday}
        />
      )}

      {schedule.freq === PaymentFrequency.MONTHLY && schedule.byMonthDay && (
        <MonthDayPicker
          selectedDay={schedule.byMonthDay}
          onDayChange={handleMonthDayChange}
          referenceDate={new Date(schedule.dtStart)}
        />
      )}

      <View style={styles.sectionRow}>
        <View style={styles.sectionHeader}>
          <Calendar
            size={16}
            color={DefaultColors.white}
          />
          <Text style={styles.sectionTitle}>Starts</Text>
        </View>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {formatDateToViewable(new Date(schedule.dtStart))}
          </Text>
        </TouchableOpacity>
        <DatePicker
          onDismiss={() => setShowStartDatePicker(false)}
          open={showStartDatePicker}
          selectedDate={new Date(schedule.dtStart)}
          onDateSelected={handleStartDateChange}
        />
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.sectionHeader}>
          <Calendar
            size={16}
            color={DefaultColors.white}
          />
          <Text style={styles.sectionTitle}>Ends</Text>
        </View>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {formatDateToViewable(new Date(schedule.until))}
          </Text>
        </TouchableOpacity>
        <DatePicker
          onDismiss={() => setShowEndDatePicker(false)}
          open={showEndDatePicker}
          selectedDate={new Date(schedule.until)}
          onDateSelected={handleEndDateChange}
        />
      </View>

      {!validation.isValid && (
        <View style={styles.errorContainer}>
          <AlertCircle
            size={16}
            color="#DC2626"
          />
          <View style={styles.errorList}>
            {validation.errors.map((error, index) => (
              <Text
                key={index}
                style={styles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View
        style={[
          styles.summaryCard,
          !validation.isValid && styles.summaryCardInvalid,
        ]}>
        <Text style={styles.summaryTitle}>Schedule Summary</Text>
        {summary ? (
          <>
            <Text style={styles.summaryText}>
              {summary.charAt(0).toUpperCase() + summary.slice(1)}
            </Text>
            {amount > 0 && (
              <Text style={styles.summaryAmount}>
                ₦{formatMoney(amount)} to lock
              </Text>
            )}
            {payoutAmount > 0 && (
              <Text style={styles.summaryAmount}>
                ₦{formatMoney(payoutAmount)} per payout
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.summaryTextInvalid}>
            Please fix the errors above to see the schedule summary
          </Text>
        )}
      </View>
    </View>
  );
}
