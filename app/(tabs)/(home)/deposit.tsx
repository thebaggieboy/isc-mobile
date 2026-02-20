import Button from "@/components/Button";
import { DefaultColors } from "@/constants/colors";
import { PAYSTACK_PUBLIC_KEY } from "@/constants/paystack";
import { formatMoney, parseMoney } from "@/utils/amount";
import { useRouter } from "expo-router";
import { ArrowLeft, CreditCard } from "lucide-react-native";
import { useRef, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Paystack, paystackProps } from "react-native-paystack-webview";

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000];
const MIN_DEPOSIT = 100; // Minimum deposit in Naira

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const numericAmount = parseInt(amount.replace(/[^0-9]/g, "")) || 0;

  const handleDeposit = () => {
    if (numericAmount < MIN_DEPOSIT) {
      Alert.alert(
        "Invalid Amount",
        `Minimum deposit amount is ₦${MIN_DEPOSIT.toLocaleString()}`
      );
      return;
    }

    // Show payment instructions (temporary until Paystack WebView is configured)
    Alert.alert(
      "Payment Information",
      `To deposit ₦${formatMoney(numericAmount)}:\n\n` +
      `1. Use the Paystack public key from settings\n` +
      `2. Test Card: 4084084084084081\n` +
      `3. CVV: 408, PIN: 0000, OTP: 123456\n\n` +
      `Note: Paystack WebView integration coming soon!`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Simulate Success",
          onPress: () => {
            Alert.alert(
              "Payment Successful! 🎉",
              `Your account has been credited with ₦${formatMoney(numericAmount)}`,
              [{ text: "Done", onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              disabled={loading}>
              <ArrowLeft
                color={DefaultColors.white}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Funds</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Amount Section */}
          <View style={styles.amountSection}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(text) => {
                  // Allow only numeric input (and maybe one decimal point if needed, but keeping it simple integer for now as per original intent)
                  // Original regex was /[^0-9]/g which means integers.
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setAmount(cleaned);
                }}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#555"
                editable={!loading}
              />
            </View>

            {/* Quick Select */}
            <View style={styles.quickSelectContainer}>
              {QUICK_AMOUNTS.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.quickAmountBtn}
                  onPress={() => handleSetAmount(val)}
                  disabled={loading}>
                  <Text style={styles.quickAmountText}>
                    ₦{val.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <CreditCard size={20} color="#ff4444" />
              <Text style={styles.infoText}>
                Secure payment via Paystack
              </Text>
            </View>
            <Text style={styles.infoSubtext}>
              Pay with debit card, bank transfer, or USSD
            </Text>
          </View>

          {/* Payment Summary */}
          {numericAmount > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>
                  ₦{formatMoney(numericAmount)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fee</Text>
                <Text style={styles.summaryValue}>₦0.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>
                  ₦{formatMoney(numericAmount)}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Button
            title={loading ? "Processing..." : "Continue to Payment"}
            onPress={handleDeposit}
            buttonStyle={[
              styles.depositBtn,
              (numericAmount < MIN_DEPOSIT || loading) && styles.depositBtnDisabled,
            ]}
            disabled={numericAmount < MIN_DEPOSIT || loading}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Paystack WebView */}
      {/* Paystack WebView removed until package is fixed */
      /* <Paystack
        paystackKey={PAYSTACK_PUBLIC_KEY}
        billingEmail="user@example.com"
        amount={numericAmount}
        onCancel={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        ref={paystackWebViewRef}
        currency="NGN"
        channels={["card", "bank", "ussd", "bank_transfer"]}
        activityIndicatorColor="#ff4444"
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  amountSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    color: "#888",
    marginBottom: 12,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: "700",
    color: DefaultColors.white,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  quickSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  quickAmountBtn: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  infoCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  infoSubtext: {
    fontSize: 13,
    color: "#888",
    marginLeft: 32,
  },
  summaryCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#888",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: DefaultColors.white,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff4444",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#111111",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  depositBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#ff4444",
  },
  depositBtnDisabled: {
    opacity: 0.5,
  },
});
