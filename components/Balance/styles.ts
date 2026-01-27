import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  BalanceView: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 24,
    height: 220,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    color: DefaultColors.white,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  label: {
    color: "#888",
    fontSize: 13,
  },
  eyeButton: {
    padding: 4,
    backgroundColor: "#222",
    borderRadius: 20,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currency: {
    color: "#888",
    fontSize: 24,
    fontWeight: "600",
    marginTop: 8, 
    marginRight: 4,
  },
  BalanceAmount: {
    fontSize: 42,
    color: DefaultColors.white,
    fontWeight: "700",
    letterSpacing: -1,
  },
  Actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: DefaultColors.white,
    height: 48,
    borderRadius: 14,
  },
  actionButtonTitle: {
    color: DefaultColors.black,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#222",
    height: 48,
    borderRadius: 14,
  },
  secondaryButtonTitle: {
    color: DefaultColors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
