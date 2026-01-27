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
    color: DefaultColors.gray,
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
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayChipActive: {
    backgroundColor: DefaultColors.black,
    borderColor: DefaultColors.black,
  },
  weekdayChipDisabled: {
    opacity: 0.6,
  },
  weekdayChipText: {
    fontWeight: "600",
    color: DefaultColors.black,
    fontSize: 13,
  },
  weekdayChipTextActive: {
    color: DefaultColors.white,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 12,
    color: DefaultColors.gray,
    marginTop: 4,
    fontStyle: "italic",
  },
});
