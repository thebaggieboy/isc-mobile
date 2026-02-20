import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    gap: 16,
    backgroundColor: "transparent",
  },
  sectionRow: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 80,
  },
  sectionTitle: {
    fontWeight: "600",
    color: DefaultColors.textSecondary,
    fontSize: 14,
  },
  selectDateButton: {
    flex: 1,
    paddingVertical: 12, // Reduced from 16
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: DefaultColors.surface,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.text,
  },

  // Auto Payout Card
  autoPayoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DefaultColors.surface,
    padding: 16, // Reduced from 20
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DefaultColors.border,
  },
  autoPayoutTextContent: {
    flex: 1,
    gap: 4,
  },
  autoPayoutTitle: {
    color: DefaultColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  autoPayoutSubtitle: {
    color: DefaultColors.textSecondary,
    fontSize: 13,
  },
  toggleButton: {
    width: 52,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: DefaultColors.surface,
    borderRadius: 20,
    padding: 24,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: DefaultColors.primary,
  },
  summaryCardInvalid: {
    borderLeftColor: DefaultColors.error,
    backgroundColor: "#2A1515", // Keep slight tint for error state
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: DefaultColors.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: DefaultColors.text,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    color: DefaultColors.primary,
    marginTop: 8,
  },
  summaryTextInvalid: {
    fontSize: 14,
    fontWeight: "500",
    color: DefaultColors.error,
    fontStyle: "italic",
  },

  // Error State
  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#2A1515",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DefaultColors.error,
  },
  errorList: {
    flex: 1,
    gap: 6,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    color: DefaultColors.error,
  },
});
