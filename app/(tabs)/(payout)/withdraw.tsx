import { useState, useEffect } from "react";
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
import { userService } from "@/services/api/user.service";
import { scheduleService } from "@/services/api/schedule.service";
import { notifyWithdrawal } from "@/services/notifications";

export default function WithdrawScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [method, setMethod] = useState<'bank' | 'wallet'>('bank');
    const [balance, setBalance] = useState(0);
    const [totalPayout, setTotalPayout] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setDataLoading(true);
            const [balanceData, payoutsData] = await Promise.all([
                userService.getBalance(),
                scheduleService.getPayouts(),
            ]);
            setBalance(balanceData?.available ?? balanceData?.balance ?? 0);
            const total = payoutsData.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
            setTotalPayout(total);
        } catch (error) {
            console.error("Failed to fetch withdraw data:", error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Invalid Amount", "Please enter a valid withdrawal amount");
            return;
        }

        if (Number(amount) > balance) {
            Alert.alert("Insufficient Balance", "You don't have enough available balance for this withdrawal.");
            return;
        }

        try {
            setLoading(true);
            // Simulate API call - Connect to real endpoint later
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess(true);

            // Fire local notification
            await notifyWithdrawal(Number(amount));

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
                {/* Balance Cards */}
                <View style={styles.balanceRow}>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>
                            {dataLoading ? "..." : `₦${formatMoney(balance)}`}
                        </Text>
                    </View>
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Total Payout</Text>
                        <Text style={[styles.balanceAmount, { fontSize: 24, color: "#888" }]}>
                            {dataLoading ? "..." : `₦${formatMoney(totalPayout)}`}
                        </Text>
                    </View>
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
    balanceRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 32,
    },
    balanceCard: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    balanceLabel: {
        color: "#888",
        fontSize: 12,
        marginBottom: 8,
        fontWeight: "500",
    },
    balanceAmount: {
        color: DefaultColors.white,
        fontSize: 28,
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
