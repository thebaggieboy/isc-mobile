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
    status: "locked" | "unlocked" | "pending";
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
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch schedules');
            }

            const result = await response.json();
            return result.data.schedules;
        } catch (error) {
            console.error('Get schedules error:', error);
            throw error;
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
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch payouts');
            }

            const result = await response.json();
            return result.data.payouts;
        } catch (error) {
            console.error('Get payouts error:', error);
            throw error;
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
};
