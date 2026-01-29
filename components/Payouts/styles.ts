import { StyleSheet } from "react-native";
import { DefaultColors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  
  payoutView: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 24,
    margin: 5,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  greeting: {
    color: DefaultColors.white,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },

  subtitle: {
    color: "#888",
    fontSize: 13,
  },

  eyeButton: {
    padding: 4,
    backgroundColor: "#222",
    borderRadius: 20,
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
  },

  highlightCard: {
    backgroundColor: "#1a1a1a",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  cardLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },

  cardAmount: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  currency: {
    color: "#888",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
    marginRight: 2,
  },

  amount: {
    fontSize: 28,
    color: DefaultColors.white,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  countdownText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },

  // History Section
  historySection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 16,
  },

  payoutCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  payoutCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },

  payoutInfo: {
    flex: 1,
  },

  payoutInterval: {
    fontSize: 15,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 4,
  },

  payoutDate: {
    fontSize: 13,
    color: "#888",
    fontWeight: "400",
  },

  payoutCardRight: {
    alignItems: "flex-end",
    gap: 6,
  },

  payoutAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#222",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
    color: DefaultColors.white,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    maxWidth: 250,
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  actionButton: {
    flex: 1,
    backgroundColor: DefaultColors.white,
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryActionButton: {
    backgroundColor: "#222",
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: DefaultColors.black,
  },

  secondaryActionText: {
    color: DefaultColors.white,
  },

  // Search and Filter Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DefaultColors.white,
    fontWeight: "500",
  },

  filterChips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
  },

  filterChipActive: {
    backgroundColor: DefaultColors.white,
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },

  filterChipTextActive: {
    color: DefaultColors.black,
  },
});