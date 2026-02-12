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
    gap: 8,
  },
  weekdayChip: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#1B1B1B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  weekdayChipActive: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  weekdayChipDisabled: {
    opacity: 0.6,
  },
  weekdayChipText: {
    fontWeight: "600",
    color: DefaultColors.white,
    fontSize: 13,
  },
  weekdayChipTextActive: {
    color: DefaultColors.white,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 12,
    color: DefaultColors.white,
    opacity: 0.6,
    marginTop: 4,
    fontStyle: "italic",
  },
});
