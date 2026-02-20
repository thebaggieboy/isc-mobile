import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './index';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
    }

    // Get the token
    // Check if we already have it stored to avoid re-sending? 
    // But backend might need refresh.
    try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            // Fallback or just get token without project ID if managed workflow handles it differently
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        const token = tokenData.data;
        console.log('Push Token:', token);

        // Send to backend
        await sendTokenToBackend(token);

        return token;
    } catch (error) {
        console.error('Error getting push token:', error);
    }
}

async function sendTokenToBackend(token: string) {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) return; // User not logged in yet

        // We use raw fetch or api instance if available. 
        // Assuming API_URL is accessible via existing service config or env.
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

        await fetch(`${API_URL}/users/push-token`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token }),
        });
        console.log('Push token sent to backend');
    } catch (error) {
        console.error('Error sending push token to backend:', error);
    }
}
