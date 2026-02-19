import { DefaultColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        gap: 12,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontWeight: "600",
        color: DefaultColors.white,
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1B1B1B",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#333333",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: DefaultColors.white,
        padding: 0,
    },
});
