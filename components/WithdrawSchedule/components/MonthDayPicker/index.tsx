import { DefaultColors } from "@/constants/colors";
import { getDaysForMonth } from "@/utils/time";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";


interface MonthDayPickerProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
  referenceDate?: Date;
  showHeader?: boolean;
  headerTitle?: string;
}

export default function MonthDayPicker({
  selectedDay,
  onDayChange,
  referenceDate = new Date(),
  showHeader = true,
  headerTitle = "On Day",
}: MonthDayPickerProps) {
  const daysInMonth = useMemo(() => {
    return getDaysForMonth(referenceDate);
  }, [referenceDate]);

  const dayOptions = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const validSelectedDay = useMemo(() => {
    return Math.min(selectedDay, daysInMonth);
  }, [selectedDay, daysInMonth]);

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.sectionHeader}>
          <Calendar size={16} color={DefaultColors.gray} />
          <Text style={styles.sectionTitle}>{headerTitle}</Text>
        </View>
      )}
      <Picker
        selectedValue={validSelectedDay}
        onValueChange={onDayChange}
        mode="dropdown"
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {dayOptions.map((day) => (
          <Picker.Item key={day} label={day.toString()} value={day} />
        ))}
      </Picker>
      {selectedDay > daysInMonth && (
        <Text style={styles.warningText}>
          Day {selectedDay} is not valid for this month. Using day{" "}
          {validSelectedDay}.
        </Text>
      )}
    </View>
  );
}
