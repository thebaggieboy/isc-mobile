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
    color: DefaultColors.gray,
  },
  inputGroupWrapper: {
    marginTop: 8,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DefaultColors.white,
    borderRadius: 8,
    padding: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#F5F5F7",
  },
  stepperButtonDisabled: {
    backgroundColor: "#EBEBEB",
    opacity: 0.5,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: DefaultColors.black,
    lineHeight: 22,
  },
  stepperButtonTextDisabled: {
    color: DefaultColors.gray,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.black,
    minWidth: 20,
    textAlign: "center",
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 10,
  },
  freqPicker: {
    backgroundColor: DefaultColors.white,
    borderWidth: 1,
    borderColor: "#E5E5E7",
    borderRadius: 10,
    color: DefaultColors.black,
  },
  pickerItem: {
    color: DefaultColors.black,
  },
});
