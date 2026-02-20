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
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: DefaultColors.white,
        padding: 0,
    },
});
