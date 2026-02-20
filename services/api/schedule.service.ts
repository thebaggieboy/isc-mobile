// services/api/schedule.service.ts
import { api } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Schedule {
    id: string;
    title: string;
    amount: number;
    payoutAmount: number;
    scheduledDate: string;
    recurrence: string;
    status: string;
    createdAt: string;
}

export interface PayoutItem {
    id: string;
    amount: number;
    lockDate: string;
    unlockDate: string;
    status: "locked" | "unlocked" | "pending" | "completed";
    interval: string;
    recurrence: string;
    title: string;
    type: 'lock' | 'schedule';
}

export const scheduleService = {
    // Create a new schedule
    createSchedule: async (data: {
        title: string;
        amount: number;
        payoutAmount: number;
        scheduledDate: Date;
        recurrence?: string;
        autoPayout?: boolean;
    }): Promise<Schedule> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/schedules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create schedule');
            }

            const result = await response.json();
            return result.data.schedule;
        } catch (error) {
            console.error('Create schedule error:', error);
            throw error;
        }
    },

    // Get user schedules
    getSchedules: async (): Promise<Schedule[]> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/schedules`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Get schedules response error:', response.status, errorText);
                throw new Error('Failed to fetch schedules');
            }

            const result = await response.json();

            // Handle different response formats defensively
            const schedules = result?.data?.schedules || result?.data || result?.schedules || result;

            if (Array.isArray(schedules)) {
                return schedules;
            }

            console.warn('Unexpected schedules response shape:', typeof schedules);
            return [];
        } catch (error) {
            console.error('Get schedules error:', error);
            return []; // Return empty array instead of throwing
        }
    },

    // Get user payouts
    getPayouts: async (): Promise<PayoutItem[]> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/schedules/payouts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Get payouts response error:', response.status, errorText);
                throw new Error('Failed to fetch payouts');
            }

            const result = await response.json();
            console.log('Payouts API response:', JSON.stringify(result).slice(0, 200));

            // Handle different response formats defensively
            const payouts = result?.data?.payouts || result?.data || result?.payouts || result;

            if (Array.isArray(payouts)) {
                return payouts;
            }

            console.warn('Unexpected payouts response shape:', typeof payouts);
            return [];
        } catch (error) {
            console.error('Get payouts error:', error);
            return []; // Return empty array instead of throwing to prevent crashes
        }
    },

    // Complete a payout manually (manual transition)
    completePayout: async (id: string, type: 'lock' | 'schedule'): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/schedules/${id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ type }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to complete payout');
            }
        } catch (error) {
            console.error('Complete payout error:', error);
            throw error;
        }
    },

    // Trigger payout simulation
    simulatePayouts: async (): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            await fetch(`${API_URL}/webhooks/simulate-payouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Simulate payouts error:', error);
            // Non-critical, so we don't throw
        }
    },
};
