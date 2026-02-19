import { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { ArrowLeft, Wallet, Building2, CheckCircle2 } from "lucide-react-native";
import { formatMoney } from "@/utils/amount";

export default function WithdrawScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [method, setMethod] = useState<'bank' | 'wallet'>('bank');

    const handleWithdraw = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Amount", "Please enter a valid withdrawal amount");
            return;
        }

        try {
            setLoading(true);
            // Simulate API call - Connect to real endpoint later
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess(true);
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            Alert.alert("Error", "Failed to process withdrawal");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <View style={styles.successCard}>
                    <CheckCircle2 size={64} color={DefaultColors.primary} />
                    <Text style={styles.successTitle}>Withdrawal Successful</Text>
                    <Text style={styles.successText}>
                        Your withdrawal of ₦{formatMoney(Number(amount))} has been processed.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={DefaultColors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Withdraw Funds</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>₦{formatMoney(150000)}</Text>
                </View>

                <Text style={styles.label}>Withdrawal Method</Text>
                <View style={styles.methodsContainer}>
                    <TouchableOpacity
                        style={[styles.methodCard, method === 'bank' && styles.methodActive]}
                        onPress={() => setMethod('bank')}
                    >
                        <Building2 size={24} color={method === 'bank' ? DefaultColors.primary : '#888'} />
                        <Text style={[styles.methodText, method === 'bank' && styles.methodTextActive]}>Bank Transfer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.methodCard, method === 'wallet' && styles.methodActive]}
                        onPress={() => setMethod('wallet')}
                    >
                        <Wallet size={24} color={method === 'wallet' ? DefaultColors.primary : '#888'} />
                        <Text style={[styles.methodText, method === 'wallet' && styles.methodTextActive]}>Crypto Wallet</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.currency}>₦</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleWithdraw}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={DefaultColors.black} />
                    ) : (
                        <Text style={styles.submitButtonText}>Confirm Withdrawal</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DefaultColors.background,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: DefaultColors.white,
    },
    backButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    balanceCard: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 32,
    },
    balanceLabel: {
        color: "#888",
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: DefaultColors.white,
        fontSize: 32,
        fontWeight: "700",
    },
    label: {
        color: DefaultColors.white,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    methodsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 32,
    },
    methodCard: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "transparent",
        gap: 8,
    },
    methodActive: {
        borderColor: DefaultColors.primary,
        backgroundColor: `${DefaultColors.primary}10`,
    },
    methodText: {
        color: "#888",
        fontSize: 14,
        fontWeight: "500",
    },
    methodTextActive: {
        color: DefaultColors.primary,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 32,
    },
    currency: {
        fontSize: 24,
        color: DefaultColors.white,
        fontWeight: "600",
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 24,
        color: DefaultColors.white,
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: DefaultColors.primary,
        height: 56,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: {
        color: DefaultColors.black,
        fontSize: 16,
        fontWeight: "600",
    },
    successCard: {
        alignItems: "center",
        gap: 16,
        padding: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: DefaultColors.white,
    },
    successText: {
        color: "#888",
        textAlign: "center",
        fontSize: 16,
    },
});
