import { StyleSheet } from "react-native";
import { DefaultColors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },

  payoutView: {
    padding: 24,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },

  greeting: {
    color: DefaultColors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    color: DefaultColors.textSecondary,
    fontSize: 15,
  },

  eyeButton: {
    width: 40,
    height: 40,
    backgroundColor: DefaultColors.surface,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: DefaultColors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: DefaultColors.border,
  },

  highlightCard: {
    backgroundColor: DefaultColors.surface,
    borderColor: DefaultColors.border, // Or Primary border if we want to highlight?
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  cardLabel: {
    color: DefaultColors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  cardAmount: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  currency: {
    color: DefaultColors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginRight: 2,
  },

  amount: {
    fontSize: 24,
    color: DefaultColors.text,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: DefaultColors.surfaceHighlight,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  countdownText: {
    fontSize: 12,
    color: DefaultColors.textSecondary,
    fontWeight: "500",
  },

  // Quick Actions
  quickActions: {
    marginBottom: 24,
  },

  withdrawButton: {
    backgroundColor: DefaultColors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: DefaultColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  withdrawButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },

  // Search and Filter Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DefaultColors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DefaultColors.border,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DefaultColors.text,
    fontWeight: "500",
  },

  filterChips: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
    flexWrap: 'wrap',
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: DefaultColors.surface,
    borderWidth: 1,
    borderColor: DefaultColors.border,
  },

  filterChipActive: {
    backgroundColor: DefaultColors.text,
    borderColor: DefaultColors.text,
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: DefaultColors.textSecondary,
  },

  filterChipTextActive: {
    color: DefaultColors.background,
  },

  // History Section
  historySection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DefaultColors.text,
    marginBottom: 20,
  },

  payoutCard: {
    backgroundColor: DefaultColors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: DefaultColors.border,
  },

  payoutCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DefaultColors.surfaceHighlight,
  },

  payoutInfo: {
    flex: 1,
  },

  payoutInterval: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.text,
    marginBottom: 4,
  },

  payoutDate: {
    fontSize: 13,
    color: DefaultColors.textSecondary,
    fontWeight: "500",
  },

  payoutCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  payoutAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.text,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: DefaultColors.surfaceHighlight,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    backgroundColor: DefaultColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    borderStyle: 'dashed',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DefaultColors.text,
    marginTop: 20,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: DefaultColors.textSecondary,
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 20,
  },
});