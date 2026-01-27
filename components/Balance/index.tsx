import { useRouter } from "expo-router";
import Button from "../Button";
import { styles } from "./styles";
import { DefaultColors } from "@/constants/colors";
import { CalendarClock, Eye, EyeOff, Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatMoney } from "@/utils/amount";

interface BalanceProps {
  balance: number;
  userName: string;
}

interface BalanceProps {
  balance: number;
  userName: string;
}

export default function Balance({ balance, userName }: BalanceProps) {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <View style={styles.BalanceView}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Good {getTimeOfDay()}, {userName}
          </Text>
          <Text style={styles.label}>Total Balance</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowBalance(!showBalance)}
          style={styles.eyeButton}
        >
          {showBalance ? (
            <Eye color={DefaultColors.white} size={20} />
          ) : (
            <EyeOff color={DefaultColors.white} size={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.BalanceAmount}>
          {showBalance ? formatMoney(balance) : "****"}
        </Text>
      </View>

      <View style={styles.Actions}>
        <Button
          buttonStyle={styles.actionButton}
          titleStyle={styles.actionButtonTitle}
          title="Deposit"
          onPress={() => router.push("/deposit")}
        >
          <Plus size={18} color={DefaultColors.black} />
        </Button>
        <Button
          buttonStyle={styles.secondaryButton}
          titleStyle={styles.secondaryButtonTitle}
          title="Schedule"
          onPress={() => {
            router.push("/schedule");
          }}
        >
          <CalendarClock size={18} color={DefaultColors.white} />
        </Button>
      </View>
    </View>
  );
}

function getTimeOfDay() {
  const hours = new Date().getHours();
  if (hours < 12) return "Morning";
  if (hours < 18) return "Afternoon";
  return "Evening";
}
