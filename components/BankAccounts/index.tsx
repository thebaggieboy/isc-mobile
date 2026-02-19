import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { DefaultColors } from "@/constants/colors";
import { Building2, Plus, Trash2, X, Check, Star } from "lucide-react-native";
import { bankService, BankAccount } from "@/services/api/bank.service";

export default function BankAccounts() {
    const [banks, setBanks] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newBank, setNewBank] = useState({ bankName: '', accountNumber: '', accountName: '' });

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            const data = await bankService.getBanks();
            setBanks(data);
        } catch (error) {
            console.error("Failed to fetch banks:", error);
            Alert.alert("Error", "Could not load bank accounts. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBanks(true);
    };

    const handleAddBank = async () => {
        if (!newBank.bankName || !newBank.accountNumber || !newBank.accountName) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (newBank.accountNumber.length !== 10) {
            Alert.alert("Error", "Account number must be 10 digits");
            return;
        }

        try {
            setSubmitting(true);
            await bankService.addBank(newBank);
            Alert.alert("Success", "Bank account added successfully! 🎉");
            setNewBank({ bankName: '', accountNumber: '', accountName: '' });
            setIsModalVisible(false);
            fetchBanks();
        } catch (error: any) {
            console.error("Failed to add bank:", error);
            Alert.alert("Error", error.message || "Failed to add bank account.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBank = (id: string) => {
        Alert.alert(
            "Remove Bank",
            "Are you sure you want to remove this bank account?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await bankService.deleteBank(id);
                            setBanks(banks.filter(b => b.id !== id));
                        } catch (error) {
                            console.error("Failed to delete bank:", error);
                            Alert.alert("Error", "Could not remove bank account.");
                        }
                    }
                }
            ]
        );
    };

    const handleSetDefault = async (id: string, isDefault: boolean) => {
        if (isDefault) return;
        try {
            await bankService.setDefaultBank(id);
            fetchBanks();
        } catch (error) {
            console.error("Failed to set default bank:", error);
        }
    };

    const renderItem = ({ item }: { item: BankAccount }) => (
        <TouchableOpacity
            style={[styles.bankCard, item.isDefault && styles.defaultBankCard]}
            onPress={() => handleSetDefault(item.id, item.isDefault)}
            activeOpacity={0.7}
        >
            <View style={styles.bankIcon}>
                <Building2 size={24} color={DefaultColors.primary} />
            </View>
            <View style={styles.bankInfo}>
                <View style={styles.bankTitleRow}>
                    <Text style={styles.bankName}>{item.bankName}</Text>
                    {item.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Star size={10} color={DefaultColors.black} fill={DefaultColors.black} />
                            <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.accountNumber}>**** {item.accountNumber.slice(-4)}</Text>
                <Text style={styles.accountName}>{item.accountName}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBank(item.id)}
            >
                <Trash2 size={20} color="#ff4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={DefaultColors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={banks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={DefaultColors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Building2 size={64} color="#333" />
                        <Text style={styles.emptyText}>No bank accounts added yet.</Text>
                        <Text style={styles.emptySubtext}>Add a bank account to enable withdrawals.</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Plus size={24} color={DefaultColors.black} />
                <Text style={styles.addButtonText}>Add New Bank</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => !submitting && setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Bank Account</Text>
                            <TouchableOpacity onPress={() => !submitting && setIsModalVisible(false)}>
                                <X size={24} color={DefaultColors.white} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Bank Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBank.bankName}
                                    onChangeText={t => setNewBank({ ...newBank, bankName: t })}
                                    placeholder="e.g. GTBank"
                                    placeholderTextColor="#666"
                                    editable={!submitting}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Account Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBank.accountNumber}
                                    onChangeText={t => setNewBank({ ...newBank, accountNumber: t })}
                                    placeholder="0123456789"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    editable={!submitting}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Account Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newBank.accountName}
                                    onChangeText={t => setNewBank({ ...newBank, accountName: t })}
                                    placeholder="John Doe"
                                    placeholderTextColor="#666"
                                    editable={!submitting}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                                onPress={handleAddBank}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={DefaultColors.black} />
                                ) : (
                                    <Text style={styles.submitButtonText}>Save Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    bankCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
    },
    defaultBankCard: {
        borderColor: DefaultColors.primary,
        backgroundColor: "rgba(220, 38, 38, 0.05)",
    },
    bankIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: `${DefaultColors.primary}15`,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
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
        fontWeight: "600",
        color: DefaultColors.white,
    },
    defaultBadge: {
        backgroundColor: DefaultColors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: DefaultColors.black,
    },
    accountNumber: {
        fontSize: 14,
        color: "#888",
        marginBottom: 2,
    },
    accountName: {
        fontSize: 12,
        color: "#666",
    },
    deleteButton: {
        padding: 8,
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: DefaultColors.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        shadowColor: DefaultColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: DefaultColors.black,
    },
    emptyState: {
        alignItems: "center",
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        color: DefaultColors.white,
        fontSize: 18,
        fontWeight: "600",
    },
    emptySubtext: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1a1a1a",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: "60%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: DefaultColors.white,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: "#888",
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#111",
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        color: DefaultColors.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    submitButton: {
        backgroundColor: DefaultColors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: DefaultColors.black,
    },
});
