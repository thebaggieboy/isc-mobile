import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import KYC from '@/components/KYC';
import SmileIDVerification from '@/components/KYC/SmileIDVerification';
import { DefaultColors } from '@/constants/colors';
import { kycService } from '@/services/api/kyc.service';

export default function KYCScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'failed' | 'unverified'>('unverified');
    const [showVerification, setShowVerification] = useState(false);

    useEffect(() => {
        fetchKYCStatus();
    }, []);

    const fetchKYCStatus = async () => {
        try {
            setLoading(true);
            const status = await kycService.getKycStatus();
            setKycStatus(status.kycStatus as any);
        } catch (error) {
            console.error("Failed to fetch KYC status", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartVerification = () => {
        setShowVerification(true);
    };

    const handleVerificationComplete = () => {
        setShowVerification(false);
        fetchKYCStatus();
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={DefaultColors.primary} />
            </SafeAreaView>
        );
    }

    if (showVerification) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.verificationWrapper}>
                    <SmileIDVerification
                        onComplete={handleVerificationComplete}
                        onCancel={() => setShowVerification(false)}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <KYC status={kycStatus} onStartVerification={handleStartVerification} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    verificationWrapper: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
});
