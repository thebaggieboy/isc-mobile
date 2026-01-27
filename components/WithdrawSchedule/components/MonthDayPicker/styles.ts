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
    fontWeight: "600",
    color: DefaultColors.gray,
  },
  picker: {
    width: 100,
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E7",
    color: DefaultColors.black,
    borderRadius: 12,
    height: 44,
  },
  pickerItem: {
    color: DefaultColors.black,
    padding: 20,
  },
  warningText: {
    fontSize: 12,
    color: "#E5A000",
    marginTop: 4,
    fontStyle: "italic",
  },
});
