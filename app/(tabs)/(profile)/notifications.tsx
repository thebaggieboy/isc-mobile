import { useEffect, useState, useRef, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DefaultColors } from "@/constants/colors";
import { useFocusEffect, useRouter } from "expo-router";
import {
    Bell,
    BellOff,
    Calendar,
    Lock,
    CheckCircle,
    ArrowDownCircle,
    ArrowUpCircle,
    RefreshCw,
    Trash2,
    CheckCheck,
    AlertCircle,
} from "lucide-react-native";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    AppNotification,
} from "@/services/notifications";

// Animated notification row
function NotificationItem({
    item,
    index,
    onPress,
}: {
    item: AppNotification;
    index: number;
    onPress: (n: AppNotification) => void;
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 60,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const getIcon = () => {
        const size = 20;
        switch (item.type) {
            case "schedule_created":
                return <Calendar size={size} color="#3B82F6" />;
            case "payout_locked":
                return <Lock size={size} color="#F59E0B" />;
            case "payout_completed":
                return <CheckCircle size={size} color="#22C55E" />;
            case "withdrawal":
                return <ArrowUpCircle size={size} color="#EF4444" />;
            case "deposit":
                return <ArrowDownCircle size={size} color="#22C55E" />;
            case "recurring_created":
                return <RefreshCw size={size} color="#8B5CF6" />;
            default:
                return <AlertCircle size={size} color="#888" />;
        }
    };

    const getAccentColor = () => {
        switch (item.type) {
            case "schedule_created":
                return "#3B82F6";
            case "payout_locked":
                return "#F59E0B";
            case "payout_completed":
                return "#22C55E";
            case "withdrawal":
                return "#EF4444";
            case "deposit":
                return "#22C55E";
            case "recurring_created":
                return "#8B5CF6";
            default:
                return "#888";
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };

    const accentColor = getAccentColor();

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    !item.read && { borderLeftWidth: 3, borderLeftColor: accentColor },
                ]}
                onPress={() => onPress(item)}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: `${accentColor}15` },
                    ]}
                >
                    {getIcon()}
                </View>
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text
                            style={[
                                styles.notificationTitle,
                                !item.read && { color: DefaultColors.white },
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Text style={styles.notificationTime}>
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />}
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchNotifications = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (e) {
            console.error("Failed to load notifications:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const handlePress = async (notification: AppNotification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
        }
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleClearAll = async () => {
        await clearNotifications();
        setNotifications([]);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={DefaultColors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Actions Bar */}
            {notifications.length > 0 && (
                <View style={styles.actionsBar}>
                    <Text style={styles.unreadLabel}>
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </Text>
                    <View style={styles.actionsRight}>
                        {unreadCount > 0 && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleMarkAllRead}
                            >
                                <CheckCheck size={16} color="#3B82F6" />
                                <Text style={styles.actionText}>Read All</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleClearAll}
                        >
                            <Trash2 size={16} color="#EF4444" />
                            <Text style={[styles.actionText, { color: "#EF4444" }]}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <NotificationItem
                        item={item}
                        index={index}
                        onPress={handlePress}
                    />
                )}
                contentContainerStyle={
                    notifications.length === 0 ? styles.emptyContainer : styles.listContent
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchNotifications(true);
                        }}
                        tintColor={DefaultColors.primary}
                        colors={[DefaultColors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <BellOff size={48} color="#555" />
                        </View>
                        <Text style={styles.emptyTitle}>No notifications yet</Text>
                        <Text style={styles.emptySubtitle}>
                            You'll see updates here when you create schedules, receive
                            payouts, or make transactions.
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DefaultColors.background,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: DefaultColors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    actionsBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    unreadLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
    },
    actionsRight: {
        flexDirection: "row",
        gap: 16,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actionText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#3B82F6",
    },
    listContent: {
        paddingVertical: 8,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
        gap: 14,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationContent: {
        flex: 1,
        gap: 4,
    },
    notificationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    notificationTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#aaa",
        flex: 1,
    },
    notificationTime: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: 13,
        color: "#888",
        lineHeight: 18,
        fontWeight: "500",
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyState: {
        alignItems: "center",
        paddingHorizontal: 40,
        gap: 12,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: DefaultColors.white,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
});
