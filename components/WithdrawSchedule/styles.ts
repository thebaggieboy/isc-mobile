import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 25,
    backgroundColor: "#111111",
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
    color: DefaultColors.white,
    opacity: 0.7,
  },
  selectDateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: "#333333",
  },
  dateButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: DefaultColors.white,
  },
  summaryCard: {
    backgroundColor: "#1B1B1B",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  summaryCardInvalid: {
    borderLeftColor: "#DC2626",
    backgroundColor: "#2A1515",
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 8,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: DefaultColors.white,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    color: "#DC2626",
    marginTop: 8,
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
    backgroundColor: "#2A1515",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
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
