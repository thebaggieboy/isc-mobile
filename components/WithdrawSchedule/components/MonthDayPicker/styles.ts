import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontWeight: "700",
    color: DefaultColors.textSecondary,
    fontSize: 12,
    textTransform: "uppercase",
  },
  picker: {
    width: 80, // Reduced from 100
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: "#333",
    color: DefaultColors.white,
    borderRadius: 12,
    height: 40, // Reduced from 44
    justifyContent: "center",
  },
  pickerItem: {
    color: DefaultColors.white,
    fontSize: 14,
  },
  warningText: {
    fontSize: 12,
    color: "#EF4444", // Better red/orange
    marginTop: 4,
    fontStyle: "italic",
  },
});
