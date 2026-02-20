import { StyleSheet, Dimensions } from "react-native";
import { DefaultColors } from "@/constants/colors";

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DefaultColors.background,
    },

    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },

    listContent: {
        padding: 24,
        paddingBottom: 100,
    },

    // Bank Card
    bankCard: {
        backgroundColor: DefaultColors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: DefaultColors.border,
    },

    defaultBankCard: {
        borderColor: DefaultColors.primary,
        backgroundColor: `${DefaultColors.primary}08`, // 5% opacity
    },

    bankIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: DefaultColors.surfaceHighlight,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: DefaultColors.border,
    },

    bankInfo: {
        flex: 1,
    },

    bankTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },

    bankName: {
        fontSize: 16,
        fontWeight: "700",
        color: DefaultColors.text,
    },

    defaultBadge: {
        backgroundColor: DefaultColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    defaultBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: DefaultColors.white,
        textTransform: 'uppercase',
    },

    accountNumber: {
        fontSize: 15,
        color: DefaultColors.textSecondary,
        marginBottom: 2,
        fontWeight: '500',
        fontVariant: ['tabular-nums'],
    },

    accountName: {
        fontSize: 13,
        color: DefaultColors.textSecondary,
        opacity: 0.8,
    },

    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: DefaultColors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },

    // Floating Action Button
    addButton: {
        position: "absolute",
        bottom: 40,
        left: 24,
        right: 24,
        backgroundColor: DefaultColors.primary,
        height: 60,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        shadowColor: DefaultColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    addButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: DefaultColors.white,
        letterSpacing: 0.5,
    },

    // Empty State
    emptyState: {
        alignItems: "center",
        marginTop: 80,
        gap: 16,
        padding: 24,
    },

    emptyText: {
        color: DefaultColors.text,
        fontSize: 20,
        fontWeight: "700",
    },

    emptySubtext: {
        color: DefaultColors.textSecondary,
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "flex-end",
    },

    modalContent: {
        backgroundColor: DefaultColors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        minHeight: height * 0.6,
        borderTopWidth: 1,
        borderColor: DefaultColors.border,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: DefaultColors.text,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: DefaultColors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
    },

    form: {
        gap: 24,
    },

    inputGroup: {
        gap: 10,
    },

    label: {
        fontSize: 14,
        color: DefaultColors.textSecondary,
        fontWeight: "600",
        marginLeft: 4,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: DefaultColors.surfaceHighlight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: DefaultColors.border,
        paddingHorizontal: 16,
        height: 56,
    },

    inputContainerActive: {
        borderColor: DefaultColors.primary,
    },

    input: {
        flex: 1,
        color: DefaultColors.text,
        fontSize: 16,
        fontWeight: '500',
        padding: 0,
    },

    submitButton: {
        backgroundColor: DefaultColors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        shadowColor: DefaultColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },

    submitButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: DefaultColors.white,
    },
});
