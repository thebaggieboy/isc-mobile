import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
  onDateSelected: (dateMillis: number) => void;
  open: boolean;
  onDismiss: () => void;
  selectedDate: Date;
}

export default function DatePicker({
  onDateSelected,
  open,
  onDismiss,
  selectedDate,
}: DatePickerProps) {
  if (!open) {
    return null;
  }

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={selectedDate}
      mode="date"
      onChange={(val, date) => {
        if (val.type === "set" && date) {
          onDateSelected(date.getTime());
        }
        onDismiss();
      }}
      minimumDate={new Date()}
      is24Hour={true}
    />
  );
}

/**
 * Every month can be
 * - per day number e.g every 26th day
 * - per week day occurence e.g every 2nd Monday
 */