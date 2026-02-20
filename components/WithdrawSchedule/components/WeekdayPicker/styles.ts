import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    color: DefaultColors.white,
    opacity: 0.7,
  },
  weekdayList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6, // Reduced from 8
  },
  weekdayChip: {
    borderRadius: 10, // Slightly tighter
    paddingVertical: 10, // Reduced from 12
    paddingHorizontal: 2,
    flex: 1,
    backgroundColor: "#1B1B1B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
    minWidth: 36,
  },
  weekdayChipActive: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  weekdayChipDisabled: {
    opacity: 0.4,
  },
  weekdayChipText: {
    fontWeight: "600",
    color: DefaultColors.textSecondary,
    fontSize: 12, // Reduced from 13
  },
  weekdayChipTextActive: {
    color: DefaultColors.white,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 11,
    color: DefaultColors.textSecondary,
    marginTop: 4,
    fontStyle: "italic",
  },
});
