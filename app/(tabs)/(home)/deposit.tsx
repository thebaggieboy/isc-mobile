import Button from "@/components/Button";
import { DefaultColors } from "@/constants/colors";
import { formatMoney } from "@/utils/amount";
import { useRouter } from "expo-router";
import { ArrowLeft, CreditCard } from "lucide-react-native";
import { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

const PRESET_AMOUNTS = [10000, 50000, 100000, 200000];

export default function Deposit() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const numericAmount = parseFloat(amount || "0");
  const isValidAmount = numericAmount >= 100;

  const handleDeposit = async () => {
    if (!isValidAmount) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Minimum deposit is ₦100',
      });
      return;
    }

    try {
      setLoading(true);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to Paystack WebView or Payment Screen
      // Since we don't have the Paystack component here yet (based on previous logs it was removed/commented),
      // We will assume a simulated success for now or navigation.

      Alert.alert(
        "Deposit Initiated",
        `You are about to deposit ₦${formatMoney(numericAmount)}. This would launch the Payment Gateway.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Simulate Success", onPress: () => {
              Toast.show({
                type: 'success',
                text1: 'Deposit Successful',
                text2: `₦${formatMoney(numericAmount)} added to wallet.`
              });
              router.back();
            }
          }
        ]
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={DefaultColors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Deposit Funds</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Enter Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                value={amount}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setAmount(cleaned);
                }}
                placeholder="0"
                placeholderTextColor={DefaultColors.textSecondary}
                keyboardType="numeric"
                style={styles.input}
                maxLength={12}
              />
            </View>
            {amount ? (
              <Text style={styles.previewText}>
                {formatMoney(numericAmount)}
              </Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Quick Select</Text>
          <View style={styles.presetContainer}>
            {PRESET_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.presetButton,
                  numericAmount === amt && styles.presetButtonActive,
                ]}
                onPress={() => setAmount(amt.toString())}
              >
                <Text
                  style={[
                    styles.presetText,
                    numericAmount === amt && styles.presetTextActive,
                  ]}
                >
                  ₦{formatMoney(amt)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoCard}>
            <CreditCard size={20} color={DefaultColors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Secure Payment</Text>
              <Text style={styles.infoDesc}>Transactions are processed securely via Paystack.</Text>
            </View>
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <Button
            title={loading ? "Processing..." : "Continue"}
            onPress={handleDeposit}
            disabled={!isValidAmount || loading}
            buttonStyle={styles.continueButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DefaultColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DefaultColors.text,
  },
  card: {
    backgroundColor: DefaultColors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    marginBottom: 32,
  },
  label: {
    color: DefaultColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '700',
    color: DefaultColors.text,
  },
  input: {
    fontSize: 32,
    fontWeight: '700',
    color: DefaultColors.text,
    flex: 1,
    padding: 0,
  },
  previewText: {
    color: DefaultColors.success,
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    color: DefaultColors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: DefaultColors.surface,
    borderWidth: 1,
    borderColor: DefaultColors.border,
    minWidth: '47%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetButtonActive: {
    backgroundColor: DefaultColors.primary,
    borderColor: DefaultColors.primary,
  },
  presetText: {
    color: DefaultColors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  presetTextActive: {
    color: '#fff',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: DefaultColors.surfaceHighlight,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  infoTitle: {
    color: DefaultColors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  infoDesc: {
    color: DefaultColors.textSecondary,
    fontSize: 12,
  },
  footer: {
    padding: 24,
    backgroundColor: DefaultColors.background,
    borderTopWidth: 1,
    borderTopColor: DefaultColors.border,
  },
  continueButton: {
    backgroundColor: DefaultColors.primary,
    borderRadius: 16,
    height: 56,
  }
});
