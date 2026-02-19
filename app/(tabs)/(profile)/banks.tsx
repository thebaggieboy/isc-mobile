import { Stack, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import BankAccounts from "@/components/BankAccounts";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function BankAccountsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={DefaultColors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Accounts</Text>
                <View style={{ width: 40 }} />
            </View>

            <BankAccounts />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DefaultColors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
    },
    backButton: {
        padding: 4,
    },
});
