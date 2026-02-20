// services/notifications.ts
// Local notification storage service using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = 'isc_notifications';

export interface AppNotification {
    id: string;
    type: 'schedule_created' | 'payout_completed' | 'payout_locked' | 'withdrawal' | 'deposit' | 'recurring_created' | 'system';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon?: string; // emoji
    metadata?: {
        amount?: number;
        scheduleId?: string;
        payoutId?: string;
    };
}

/**
 * Get all notifications, sorted by most recent first.
 */
export async function getNotifications(): Promise<AppNotification[]> {
    try {
        const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (!raw) return [];
        const notifications: AppNotification[] = JSON.parse(raw);
        return notifications.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    } catch (error) {
        console.error('Failed to get notifications:', error);
        return [];
    }
}

/**
 * Add a new notification.
 */
export async function addNotification(
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
): Promise<void> {
    try {
        const existing = await getNotifications();
        const newNotification: AppNotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            timestamp: new Date().toISOString(),
            read: false,
        };
        existing.unshift(newNotification);
        // Keep only the last 100 notifications
        const trimmed = existing.slice(0, 100);
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Failed to add notification:', error);
    }
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notificationId: string): Promise<void> {
    try {
        const existing = await getNotifications();
        const updated = existing.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead(): Promise<void> {
    try {
        const existing = await getNotifications();
        const updated = existing.map((n) => ({ ...n, read: true }));
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to mark all as read:', error);
    }
}

/**
 * Get count of unread notifications.
 */
export async function getUnreadCount(): Promise<number> {
    try {
        const existing = await getNotifications();
        return existing.filter((n) => !n.read).length;
    } catch (error) {
        return 0;
    }
}

/**
 * Clear all notifications.
 */
export async function clearNotifications(): Promise<void> {
    try {
        await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
        console.error('Failed to clear notifications:', error);
    }
}

// ──────── Convenience helpers for common events ────────

export function notifyScheduleCreated(title: string, amount: number, scheduleId?: string) {
    return addNotification({
        type: 'schedule_created',
        title: '📅 Schedule Created',
        message: `Your schedule "${title}" for ₦${amount.toLocaleString()} has been created.`,
        icon: '📅',
        metadata: { amount, scheduleId },
    });
}

export function notifyPayoutLocked(title: string, amount: number, payoutId?: string) {
    return addNotification({
        type: 'payout_locked',
        title: '🔒 Funds Locked',
        message: `₦${amount.toLocaleString()} has been locked for "${title}".`,
        icon: '🔒',
        metadata: { amount, payoutId },
    });
}

export function notifyPayoutCompleted(title: string, amount: number, payoutId?: string) {
    return addNotification({
        type: 'payout_completed',
        title: '✅ Payout Completed',
        message: `₦${amount.toLocaleString()} from "${title}" has been unlocked and added to your balance.`,
        icon: '✅',
        metadata: { amount, payoutId },
    });
}

export function notifyRecurringCreated(title: string, amount: number, nextDate: string) {
    return addNotification({
        type: 'recurring_created',
        title: '🔄 Next Recurring Schedule',
        message: `A new "${title}" for ₦${amount.toLocaleString()} has been scheduled for ${nextDate}.`,
        icon: '🔄',
        metadata: { amount },
    });
}

export function notifyWithdrawal(amount: number) {
    return addNotification({
        type: 'withdrawal',
        title: '💸 Withdrawal Initiated',
        message: `You initiated a withdrawal of ₦${amount.toLocaleString()}.`,
        icon: '💸',
        metadata: { amount },
    });
}

export function notifyDeposit(amount: number) {
    return addNotification({
        type: 'deposit',
        title: '💰 Deposit Received',
        message: `₦${amount.toLocaleString()} has been deposited into your account.`,
        icon: '💰',
        metadata: { amount },
    });
}
