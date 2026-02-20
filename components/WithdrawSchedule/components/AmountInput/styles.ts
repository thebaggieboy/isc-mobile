import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: DefaultColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: DefaultColors.textSecondary,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: DefaultColors.white,
    padding: 0,
  },
});
