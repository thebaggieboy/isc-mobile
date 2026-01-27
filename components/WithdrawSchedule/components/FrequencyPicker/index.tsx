import { DefaultColors } from "@/constants/colors";
import { PaymentFrequency } from "@/types/schema";
import { Picker } from "@react-native-picker/picker";
import { Settings2 } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { getMaxIntervalForFrequency } from "../../utils";

interface FrequencyPickerProps {
  frequency: PaymentFrequency;
  interval: number;
  onFrequencyChange: (freq: PaymentFrequency) => void;
  onIntervalChange: (interval: number) => void;
}

const paymentFrequencyList = [
  PaymentFrequency.DAILY,
  PaymentFrequency.WEEKLY,
  PaymentFrequency.MONTHLY,
];

const freqToText: Record<PaymentFrequency, string> = {
  [PaymentFrequency.DAILY]: "Day",
  [PaymentFrequency.WEEKLY]: "Week",
  [PaymentFrequency.MONTHLY]: "Month",
};

export default function FrequencyPicker({
  frequency,
  interval,
  onFrequencyChange,
  onIntervalChange,
}: FrequencyPickerProps) {
  const maxInterval = useMemo(() => {
    return getMaxIntervalForFrequency(frequency);
  }, [frequency]);

  const handleIncrement = () => {
    onIntervalChange(Math.min(interval + 1, maxInterval));
  };

  const handleDecrement = () => {
    onIntervalChange(Math.max(interval - 1, 1));
  };

  const canIncrement = interval < maxInterval;
  const canDecrement = interval > 1;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Settings2 size={16} color={DefaultColors.gray} />
        <Text style={styles.sectionTitle}>Repeat every</Text>
      </View>
      <View style={styles.inputGroupWrapper}>
        <View style={styles.inputGroup}>
          <View style={styles.stepperContainer}>
            <Pressable
              onPress={handleDecrement}
              disabled={!canDecrement}
              style={[
                styles.stepperButton,
                !canDecrement && styles.stepperButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.stepperButtonText,
                  !canDecrement && styles.stepperButtonTextDisabled,
                ]}
              >
                −
              </Text>
            </Pressable>
            <Text style={styles.stepperValue}>{interval}</Text>
            <Pressable
              onPress={handleIncrement}
              disabled={!canIncrement}
              style={[
                styles.stepperButton,
                !canIncrement && styles.stepperButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.stepperButtonText,
                  !canIncrement && styles.stepperButtonTextDisabled,
                ]}
              >
                +
              </Text>
            </Pressable>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={frequency}
              onValueChange={onFrequencyChange}
              mode="dropdown"
              style={styles.freqPicker}
              itemStyle={styles.pickerItem}
            >
              {paymentFrequencyList.map((freq) => {
                const isPlural = interval > 1 && freq === frequency;
                return (
                  <Picker.Item
                    key={freq}
                    label={freqToText[freq] + (isPlural ? "s" : "")}
                    value={freq}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
}
