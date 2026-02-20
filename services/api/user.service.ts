// services/api/user.service.ts
import { api } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  kycStatus?: 'pending' | 'verified' | 'failed' | 'unverified';
}

export interface UserBalance {
  balance: number;
  totalLocked: number;
  available: number;
  currency?: string;
}

export interface UserStats {
  savedThisMonth: number;
  impulsesStopped: number;
  currentStreak: number;
  savingsGoal: number;
}

export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
      }

      const result = await response.json();
      return result.data?.user || result.data || result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Get user balance
  getBalance: async (): Promise<UserBalance> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/user/balance?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch balance');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  },

  // Get user stats
  getStats: async (): Promise<UserStats> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/user/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch stats');
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<Pick<UserProfile, 'fullName' | 'phone'>>): Promise<UserProfile> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      return result.data?.user || result.data || result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};