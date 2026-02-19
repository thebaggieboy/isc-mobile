// services/api/bank.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode?: string;
    isDefault: boolean;
    createdAt: string;
}

export const bankService = {
    // Get all user banks
    getBanks: async (): Promise<BankAccount[]> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/banks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch banks');
            }

            const result = await response.json();
            return result.data.banks;
        } catch (error) {
            console.error('Get banks error:', error);
            throw error;
        }
    },

    // Add a new bank
    addBank: async (data: {
        bankName: string;
        accountNumber: string;
        accountName: string;
        bankCode?: string;
        isDefault?: boolean;
    }): Promise<BankAccount> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/banks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add bank');
            }

            const result = await response.json();
            return result.data.bank;
        } catch (error) {
            console.error('Add bank error:', error);
            throw error;
        }
    },

    // Delete a bank
    deleteBank: async (id: string): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/banks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete bank');
            }
        } catch (error) {
            console.error('Delete bank error:', error);
            throw error;
        }
    },

    // Set a bank as default
    setDefaultBank: async (id: string): Promise<BankAccount> => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/banks/${id}/default`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to set default bank');
            }

            const result = await response.json();
            return result.data.bank;
        } catch (error) {
            console.error('Set default bank error:', error);
            throw error;
        }
    },
};
