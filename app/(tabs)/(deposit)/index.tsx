import Button from "@/components/Button";
import { DefaultColors } from "@/constants/colors";
import { formatMoney, parseMoney } from "@/utils/amount";
import { useRouter } from "expo-router";
import { ChevronLeft, CreditCard, Landmark, Loader2 } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePaystack } from 'react-native-paystack-webview';
import { userService, UserProfile } from "@/services/api/user.service";
import { api } from "@/services/api";
import { notifyDeposit } from "@/services/notifications";

const QUICK_AMOUNTS = [10000, 50000, 100000, 200000];

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { popup } = usePaystack();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  };

  const handleSetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleDeposit = async () => {
    const numAmount = Number(amount);

    // Validation
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid deposit amount.");
      return;
    }

    if (numAmount < 1000) {
      Alert.alert("Minimum Deposit", "The minimum deposit amount is ₦1,000.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "Unable to load your account. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create pending transaction on backend to get reference
      const depositResult = await api.post('/transactions/deposit', {
        amount: numAmount,
      });

      const reference = depositResult.data?.reference || depositResult.reference;

      if (!reference) {
        Alert.alert("Error", "Failed to initiate deposit. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);

      // 2. Open Paystack WebView with the reference
      popup.checkout({
        email: user.email,
        amount: numAmount,
        reference: reference,
        onCancel: () => {
          setLoading(false);
          Alert.alert("Cancelled", "Deposit was cancelled.");
        },
        onSuccess: (res: any) => handlePaystackSuccess(reference),
        onError: (err: any) => {
          console.error("Paystack error:", err);
          Alert.alert("Payment Error", "Something went wrong with the payment. Please try again.");
        },
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to initiate deposit. Please try again.");
      console.error("Deposit initiation error:", error);
    }
  };

  const handlePaystackSuccess = async (reference: string) => {
    try {
      setLoading(true);

      // 3. Verify transaction with backend — this credits the user's balance
      await api.post('/transactions/verify', {
        reference: reference,
      });

      // Fire local notification
      await notifyDeposit(Number(amount));

      Alert.alert("Success", "Deposit successful! Your balance has been updated.", [
        { text: "OK", onPress: () => router.push("/(tabs)/(home)") }
      ]);
    } catch (error: any) {
      Alert.alert(
        "Verification Failed",
        "Payment was successful but verification failed. Please contact support with reference: " + reference
      );
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const amountParsed = parseMoney(amount);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <ChevronLeft
                color={DefaultColors.white}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Deposit</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.label}>Enter Amount</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#666"
                onBlur={() => {
                  if (amount) {
                    const num = parseFloat(amount);
                    if (!isNaN(num)) setAmount(num.toString()); // Keep it simpler for now, or use formatMoney? 
                    // actually formatMoney adds commas which we stripped. 
                    // If we want commas, we need to handle them in onChangeText. 
                    // For now, let's just leave raw number OR handle commas properly.
                    // Let's just NOT format on blur to avoid complex edit state.
                  }
                }}
              />
            </View>

            <View style={styles.quickSelectContainer}>
              {QUICK_AMOUNTS.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.quickAmountBtn}
                  onPress={() => handleSetAmount(val)}>
                  <Text style={styles.quickAmountText}>
                    + ₦{val.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            <TouchableOpacity style={styles.methodCard}>
              <View style={styles.methodIconWrapper}>
                <CreditCard
                  color={DefaultColors.white}
                  size={20}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Pay with Paystack</Text>
                <Text style={styles.methodDesc}>
                  Card, Bank Transfer, USSD
                </Text>
              </View>
              <View style={styles.radioActive} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {loading ? (
            <View style={styles.loadingBtn}>
              <ActivityIndicator color={DefaultColors.white} />
              <Text style={styles.loadingBtnText}>Processing...</Text>
            </View>
          ) : (
            <Button
              title="Continue"
              onPress={handleDeposit}
              disabled={loading}
              buttonStyle={styles.depositBtn}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.black,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  amountSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 10,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: "700",
    color: DefaultColors.white,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  quickSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  quickAmountBtn: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
    marginBottom: 15,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  methodIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#222",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  methodDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  radioActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: DefaultColors.primary || "#ff4444",
    backgroundColor: DefaultColors.white,
  },
  radioInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  depositBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: DefaultColors.primary || "#ff4444",
  },
  loadingBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: DefaultColors.primary || "#ff4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingBtnText: {
    color: DefaultColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
