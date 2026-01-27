import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 25,
  },
  sectionRow: {
    gap: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  selectDateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  dateButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: DefaultColors.black,
  },
  summaryCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: DefaultColors.black,
  },
  summaryCardInvalid: {
    borderLeftColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: DefaultColors.gray,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: DefaultColors.black,
  },
  summaryTextInvalid: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#DC2626",
    fontStyle: "italic",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorList: {
    flex: 1,
    gap: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DC2626",
  },
  // Legacy styles kept for compatibility (can be removed if not used elsewhere)
  rowLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  rowValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.black,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: DefaultColors.black,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: DefaultColors.gray,
    minWidth: 60,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  toggleItemActive: {
    backgroundColor: DefaultColors.white,
    borderColor: DefaultColors.black,
    borderWidth: 1.5,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: DefaultColors.gray,
  },
  toggleTextActive: {
    color: DefaultColors.black,
    fontWeight: "700",
  },
});
