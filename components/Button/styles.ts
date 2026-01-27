import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: DefaultColors.black,
    borderRadius: 10,
    paddingBlock: 10,
    paddingInline: 20,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: DefaultColors.white,
    fontSize: 16,
    fontWeight: 500,
  },

});
