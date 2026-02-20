import { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { DefaultColors } from "@/constants/colors";
import { Building2, Plus, Trash2, X, Star, CreditCard, User } from "lucide-react-native";
import { bankService, BankAccount } from "@/services/api/bank.service";
import { styles } from "./styles";

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
            // Silent error or minimal toast preferred
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
            Alert.alert("Missing Fields", "Please fill in all bank details.");
            return;
        }

        if (newBank.accountNumber.length !== 10) {
            Alert.alert("Invalid Account", "Account number must be 10 digits.");
            return;
        }

        try {
            setSubmitting(true);
            await bankService.addBank(newBank);
            Alert.alert("Success", "Bank account added successfully!");
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
            // Optimistic update
            const updatedBanks = banks.map(b => ({
                ...b,
                isDefault: b.id === id
            }));
            setBanks(updatedBanks);

            await bankService.setDefaultBank(id);
            // Refetch to be sure
            fetchBanks();
        } catch (error) {
            console.error("Failed to set default bank:", error);
            Alert.alert("Error", "Failed to update default bank.");
            fetchBanks(); // Revert on error
        }
    };

    const renderItem = ({ item }: { item: BankAccount }) => (
        <TouchableOpacity
            style={[styles.bankCard, item.isDefault && styles.defaultBankCard]}
            onPress={() => handleSetDefault(item.id, item.isDefault)}
            activeOpacity={0.7}
        >
            <View style={[styles.bankIcon, item.isDefault && { borderColor: DefaultColors.primary }]}>
                <Building2 size={24} color={item.isDefault ? DefaultColors.primary : DefaultColors.textSecondary} />
            </View>
            <View style={styles.bankInfo}>
                <View style={styles.bankTitleRow}>
                    <Text style={[styles.bankName, item.isDefault && { color: DefaultColors.primary }]}>{item.bankName}</Text>
                    {item.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Star size={10} color={DefaultColors.white} fill={DefaultColors.white} />
                            <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.accountNumber}>**** {item.accountNumber.slice(-4)}</Text>
                <Text style={styles.accountName}>{item.accountName}</Text>
            </View>
            {!item.isDefault && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBank(item.id)}
                >
                    <Trash2 size={18} color={DefaultColors.error} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    if (loading && !refreshing && banks.length === 0) {
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
                        <Building2 size={64} color={DefaultColors.surfaceHighlight} />
                        <Text style={styles.emptyText}>No bank accounts</Text>
                        <Text style={styles.emptySubtext}>Add a bank account to enable automatic payouts and withdrawals.</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Plus size={24} color={DefaultColors.white} />
                <Text style={styles.addButtonText}>Add New Bank</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => !submitting && setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add Bank Account</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => !submitting && setIsModalVisible(false)}
                                >
                                    <X size={20} color={DefaultColors.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Bank Name</Text>
                                    <View style={styles.inputContainer}>
                                        <Building2 size={20} color={DefaultColors.textSecondary} style={{ marginRight: 10 }} />
                                        <TextInput
                                            style={styles.input}
                                            value={newBank.bankName}
                                            onChangeText={t => setNewBank({ ...newBank, bankName: t })}
                                            placeholder="e.g. GTBank"
                                            placeholderTextColor={DefaultColors.textSecondary}
                                            editable={!submitting}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Account Number</Text>
                                    <View style={styles.inputContainer}>
                                        <CreditCard size={20} color={DefaultColors.textSecondary} style={{ marginRight: 10 }} />
                                        <TextInput
                                            style={styles.input}
                                            value={newBank.accountNumber}
                                            onChangeText={t => setNewBank({ ...newBank, accountNumber: t })}
                                            placeholder="0123456789"
                                            placeholderTextColor={DefaultColors.textSecondary}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            editable={!submitting}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Account Name</Text>
                                    <View style={styles.inputContainer}>
                                        <User size={20} color={DefaultColors.textSecondary} style={{ marginRight: 10 }} />
                                        <TextInput
                                            style={styles.input}
                                            value={newBank.accountName}
                                            onChangeText={t => setNewBank({ ...newBank, accountName: t })}
                                            placeholder="Matches your BVN name"
                                            placeholderTextColor={DefaultColors.textSecondary}
                                            editable={!submitting}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                                    onPress={handleAddBank}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <ActivityIndicator color={DefaultColors.white} />
                                    ) : (
                                        <Text style={styles.submitButtonText}>Save Details</Text>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}
