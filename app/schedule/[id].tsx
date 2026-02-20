import { useLocalSearchParams, useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Info,
    TrendingDown,
    Trash2,
    Lock,
    Wallet,
    Target,
    CalendarCheck,
    ArrowDownRight
} from "lucide-react-native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/amount";
import { useEffect, useState } from "react";
import { scheduleService, Schedule } from "@/services/api/schedule.service";
import { userService, UserBalance } from "@/services/api/user.service";

export default function ScheduleDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [balance, setBalance] = useState<UserBalance | null>(null);

    useEffect(() => {
        fetchScheduleDetails();
    }, [id]);

    const fetchScheduleDetails = async () => {
        try {
            setLoading(true);
            const [schedules, balanceData] = await Promise.all([
                scheduleService.getSchedules(),
                userService.getBalance(),
            ]);
            const found = schedules.find(s => s.id === id);
            setSchedule(found || null);
            setBalance(balanceData);
        } catch (error) {
            console.error("Failed to fetch schedule details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePayout = async () => {
        if (!schedule || schedule.status === "completed") return;

        try {
            setLoading(true);
            await scheduleService.completePayout(schedule.id, 'schedule');
            Alert.alert("Success", "Schedule successfully completed! Funds are now available.");
            fetchScheduleDetails();
        } catch (error: any) {
            console.error("Failed to complete schedule:", error);
            Alert.alert("Error", error.message || "Failed to complete schedule.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Cancel Schedule",
            "Are you sure you want to cancel this withdrawal schedule?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Development", "Delete functionality coming soon.");
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={DefaultColors.primary} />
            </SafeAreaView>
        );
    }

    if (!schedule) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Text style={{ color: "white" }}>Schedule not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: DefaultColors.primary }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const getStatusColor = () => {
        switch (schedule.status) {
            case "completed": return "#22C55E";
            case "pending": return "#F59E0B";
            case "locked": return "#3B82F6";
            default: return "#888";
        }
    };

    // Calculate days remaining until scheduled date
    const scheduledDate = new Date(schedule.scheduledDate);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const isCompleted = schedule.status === "completed";
    const isPast = scheduledDate <= now;

    // Projected balance after schedule completes (current balance + payout amount from this schedule)
    const currentBalance = balance?.balance || 0;
    const totalLocked = (balance as any)?.totalLocked || 0;
    const projectedBalance = isCompleted ? currentBalance : currentBalance + Number(schedule.payoutAmount);

    // Format date nicely
    const formatDate = (dateStr: string | Date) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={DefaultColors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule Details</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Top Info Card */}
                    <View style={styles.infoCard}>
                        <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor()}20` }]}>
                            <Calendar size={32} color={getStatusColor()} />
                        </View>
                        <Text style={styles.title}>{schedule.title}</Text>
                        <View style={styles.statusBadgeRow}>
                            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
                                <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
                                    {schedule.status}
                                </Text>
                            </View>
                            <Text style={styles.recurrenceText}>{schedule.recurrence}</Text>
                        </View>

                        <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Total Targeted Payout</Text>
                            <View style={styles.amountRow}>
                                <Text style={styles.currency}>₦</Text>
                                <Text style={styles.amount}>{formatMoney(schedule.payoutAmount)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Stats Row */}
                    <View style={styles.quickStatsRow}>
                        <View style={styles.quickStatCard}>
                            <Lock size={18} color="#3B82F6" />
                            <Text style={styles.quickStatValue}>₦{formatMoney(totalLocked)}</Text>
                            <Text style={styles.quickStatLabel}>Total Locked</Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <CalendarCheck size={18} color={isCompleted || isPast ? "#22C55E" : "#F59E0B"} />
                            <Text style={styles.quickStatValue}>
                                {isCompleted ? "Done" : isPast ? "Due" : `${daysRemaining}d`}
                            </Text>
                            <Text style={styles.quickStatLabel}>
                                {isCompleted ? "Completed" : isPast ? "Overdue" : "Remaining"}
                            </Text>
                        </View>
                        <View style={styles.quickStatCard}>
                            <Wallet size={18} color="#22C55E" />
                            <Text style={styles.quickStatValue}>₦{formatMoney(projectedBalance)}</Text>
                            <Text style={styles.quickStatLabel}>After Payout</Text>
                        </View>
                    </View>

                    {/* Breakdown Section */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Breakdown</Text>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <Info size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Base Amount</Text>
                            </View>
                            <Text style={styles.detailValue}>₦{formatMoney(schedule.amount)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <TrendingDown size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Locked Funds</Text>
                            </View>
                            <Text style={styles.detailValue}>₦{formatMoney(schedule.amount)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <Target size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Payout Amount</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: "#22C55E" }]}>
                                ₦{formatMoney(schedule.payoutAmount)}
                            </Text>
                        </View>

                        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.detailLabel}>
                                <Clock size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Frequency</Text>
                            </View>
                            <Text style={styles.detailValue}>{schedule.recurrence}</Text>
                        </View>
                    </View>

                    {/* Timing Section */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Timing</Text>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <Clock size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Created On</Text>
                            </View>
                            <Text style={styles.detailValue}>
                                {formatDate(schedule.createdAt)}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <CalendarCheck size={16} color="#888" />
                                <Text style={styles.detailLabelText}>Ends On</Text>
                            </View>
                            <Text style={styles.detailValue}>
                                {(() => {
                                    const parts = (schedule.recurrence || '').split(';').find(p => p.startsWith('until='));
                                    return parts ? formatDate(parts.split('=')[1]) : formatDate(schedule.scheduledDate);
                                })()}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailLabel}>
                                <Calendar size={16} color="#888" />
                                <Text style={styles.detailLabelText}>
                                    {isCompleted ? "Completed" : isPast ? "Overdue By" : "Time Left"}
                                </Text>
                            </View>
                            <Text style={[styles.detailValue, {
                                color: isCompleted ? "#22C55E" : isPast ? "#EF4444" : DefaultColors.white
                            }]}>
                                {isCompleted
                                    ? "Payout processed"
                                    : isPast
                                        ? `${Math.abs(daysRemaining)} days ago`
                                        : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
                            </Text>
                        </View>
                    </View>

                    {/* Projected Balance Card */}
                    <View style={styles.projectedCard}>
                        <View style={styles.projectedHeader}>
                            <ArrowDownRight size={20} color="#22C55E" />
                            <Text style={styles.projectedTitle}>
                                {isCompleted ? "Balance After Payout" : "Projected Balance After Payout"}
                            </Text>
                        </View>
                        <View style={styles.projectedRow}>
                            <View>
                                <Text style={styles.projectedLabel}>Current Balance</Text>
                                <Text style={styles.projectedValue}>₦{formatMoney(currentBalance)}</Text>
                            </View>
                            <View style={styles.projectedDivider} />
                            <View>
                                <Text style={styles.projectedLabel}>
                                    {isCompleted ? "After Payout" : "After Completion"}
                                </Text>
                                <Text style={[styles.projectedValue, { color: "#22C55E" }]}>
                                    ₦{formatMoney(projectedBalance)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Complete Payout Button */}
                    {!isCompleted && (
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={handleCompletePayout}
                        >
                            <Text style={styles.completeButtonText}>Complete Payout</Text>
                        </TouchableOpacity>
                    )}

                    {/* Info Card */}
                    <View style={styles.instructionCard}>
                        <Info size={20} color={DefaultColors.primary} />
                        <Text style={styles.instructionText}>
                            {isCompleted
                                ? "This schedule has been completed and the funds have been added to your available balance."
                                : "Your funds will be automatically processed on the scheduled date and moved to your available balance for withdrawal."}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
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
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    deleteButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "white",
        marginBottom: 8,
        textAlign: "center",
    },
    statusBadgeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    recurrenceText: {
        fontSize: 14,
        color: "#888",
        fontWeight: "500",
    },
    amountContainer: {
        width: "100%",
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
    },
    amountLabel: {
        fontSize: 14,
        color: "#888",
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    currency: {
        fontSize: 20,
        color: "#888",
        fontWeight: "600",
        marginTop: 6,
        marginRight: 4,
    },
    amount: {
        fontSize: 40,
        fontWeight: "700",
        color: "white",
    },
    // Quick Stats
    quickStatsRow: {
        flexDirection: "row",
        gap: 10,
    },
    quickStatCard: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    quickStatValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "white",
    },
    quickStatLabel: {
        fontSize: 10,
        color: "#888",
        fontWeight: "500",
        textAlign: "center",
    },
    // Details
    detailsSection: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    detailLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    detailLabelText: {
        fontSize: 14,
        color: "#888",
    },
    detailValue: {
        fontSize: 14,
        color: "white",
        fontWeight: "600",
    },
    // Projected Balance
    projectedCard: {
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(34, 197, 94, 0.15)",
        gap: 16,
    },
    projectedHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    projectedTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "white",
    },
    projectedRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    projectedLabel: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
        textAlign: "center",
    },
    projectedValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
    },
    projectedDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    // Complete Button
    completeButton: {
        backgroundColor: DefaultColors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
    },
    completeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    // Instruction
    instructionCard: {
        flexDirection: "row",
        backgroundColor: "rgba(220, 38, 38, 0.05)",
        borderRadius: 16,
        padding: 16,
        gap: 12,
        alignItems: "flex-start",
    },
    instructionText: {
        flex: 1,
        fontSize: 13,
        color: "#888",
        lineHeight: 18,
    },
});
