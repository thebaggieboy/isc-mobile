import { DefaultColors } from "@/constants/colors";
import { formatMoney, parseMoney } from "@/utils/amount";
import { DollarSign } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

interface PayoutAmountInputProps {
    amount: number;
    onAmountChange: (amount: number) => void;
}

export default function PayoutAmountInput({
    amount,
    onAmountChange,
}: PayoutAmountInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAmountChange = (text: string) => {
        setInputValue(text);
        const parsed = parseMoney(text);
        if (parsed) {
            // Remove commas to get the actual number
            const numericValue = parseInt(text.replace(/[^0-9]/g, "")) || 0;
            onAmountChange(numericValue);
        } else if (text === "") {
            onAmountChange(0);
        }
    };

    const displayValue = inputValue || (amount > 0 ? formatMoney(amount) : "");

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <DollarSign
                    size={16}
                    color={DefaultColors.white}
                />
                <Text style={styles.title}>Payout amount</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                    style={styles.input}
                    value={displayValue}
                    onChangeText={handleAmountChange}
                    placeholder="0"
                    placeholderTextColor={DefaultColors.gray}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
}
