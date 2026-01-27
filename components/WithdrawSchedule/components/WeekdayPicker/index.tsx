import { DefaultColors } from "@/constants/colors";
import { Weekday } from "@/types/schema";
import { Calendar } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";

/**
 * Weekday labels using RRule convention (Monday=0, Sunday=6)
 */
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface WeekdayPickerProps {
  selectedWeekdays: Weekday[];
  onToggleWeekday: (dayIndex: number) => void;
  showHeader?: boolean;
  headerTitle?: string;
}

export default function WeekdayPicker({
  selectedWeekdays,
  onToggleWeekday,
  showHeader = true,
  headerTitle = "On these days",
}: WeekdayPickerProps) {
  const isSelected = (dayIndex: number): boolean => {
    return selectedWeekdays.some((wd) => wd.weekday === dayIndex);
  };

  const onlyOneSelected = (dayIndex: number): boolean => {
    return isSelected(dayIndex) && selectedWeekdays.length === 1;
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.sectionHeader}>
          <Calendar size={16} color={DefaultColors.gray} />
          <Text style={styles.sectionTitle}>{headerTitle}</Text>
        </View>
      )}
      <View style={styles.weekdayList}>
        {WEEKDAY_LABELS.map((label, index) => {
          const selected = isSelected(index);
          const isOnlyOne = onlyOneSelected(index);

          return (
            <Pressable
              key={label}
              onPress={() => onToggleWeekday(index)}
              disabled={isOnlyOne}
              style={[
                styles.weekdayChip,
                selected && styles.weekdayChipActive,
                isOnlyOne && styles.weekdayChipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.weekdayChipText,
                  selected && styles.weekdayChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selectedWeekdays.length === 1 && (
        <Text style={styles.helperText}>
          At least one day must be selected
        </Text>
      )}
    </View>
  );
}
