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
    color: DefaultColors.white,
    opacity: 0.7,
  },
  inputGroupWrapper: {
    marginTop: 8,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B1B1B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 8,
    padding: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#1B1B1B",
  },
  stepperButtonDisabled: {
    backgroundColor: "#0A0A0A",
    opacity: 0.5,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: DefaultColors.white,
    lineHeight: 22,
  },
  stepperButtonTextDisabled: {
    color: DefaultColors.gray,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    minWidth: 20,
    textAlign: "center",
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 10,
  },
  freqPicker: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 10,
    color: DefaultColors.white,
  },
  pickerItem: {
    color: DefaultColors.white,
  },
});
