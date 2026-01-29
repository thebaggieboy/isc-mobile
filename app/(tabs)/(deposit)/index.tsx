import Button from "@/components/Button";
import { DefaultColors } from "@/constants/colors";
import { formatMoney, parseMoney } from "@/utils/amount";
import { useRouter } from "expo-router";
import { ChevronLeft, CreditCard, Landmark } from "lucide-react-native";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000];

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleSetAmount = (val: number) => {
    setAmount(val.toString());
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
                color={DefaultColors.black}
                size={28}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Deposit</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.label}>Enter Amount</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                style={styles.input}
                value={amountParsed}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#999"
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
                <Landmark
                  color={DefaultColors.black}
                  size={20}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Bank Transfer</Text>
                <Text style={styles.methodDesc}>
                  Instant deposit via bank app
                </Text>
              </View>
              <View style={styles.radioActive} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.methodCard}>
              <View style={styles.methodIconWrapper}>
                <CreditCard
                  color={DefaultColors.black}
                  size={20}
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Debit Card</Text>
                <Text style={styles.methodDesc}>
                  Pay using Master/Visa card
                </Text>
              </View>
              <View style={styles.radioInactive} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() => console.log("Depositing", amount)}
            buttonStyle={styles.depositBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.white,
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: DefaultColors.black,
  },
  amountSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: DefaultColors.black,
    paddingVertical: 10,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: "700",
    color: DefaultColors.black,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
    color: DefaultColors.black,
  },
  quickSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  quickAmountBtn: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: "600",
    color: DefaultColors.black,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.black,
    marginBottom: 15,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DefaultColors.white,
    borderWidth: 1,
    borderColor: "#EEE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
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
    color: DefaultColors.black,
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
    borderWidth: 6,
    borderColor: DefaultColors.black,
  },
  radioInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DDD",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  depositBtn: {
    height: 56,
    borderRadius: 16,
  },
});
