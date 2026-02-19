import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DefaultColors } from '@/constants/colors';
import { ChevronRight, ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react-native';

interface KYCProps {
    status: 'pending' | 'verified' | 'failed' | 'unverified';
    onStartVerification: () => void;
}

export default function KYC({ status, onStartVerification }: KYCProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'verified': return '#4CAF50';
            case 'pending': return '#FFC107';
            case 'failed': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'verified': return <BadgeCheck size={32} color={DefaultColors.white} />;
            case 'pending': return <ShieldCheck size={32} color={DefaultColors.white} />;
            case 'failed': return <ShieldAlert size={32} color={DefaultColors.white} />;
            default: return <ShieldAlert size={32} color={DefaultColors.white} />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'verified': return 'Verified';
            case 'pending': return 'Pending Review';
            case 'failed': return 'Verification Failed';
            default: return 'Unverified';
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: getStatusColor() }]}>
                <View style={styles.iconContainer}>
                    {getStatusIcon()}
                </View>
                <View style={styles.statusInfo}>
                    <Text style={styles.statusLabel}>KYC Status</Text>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    {status === 'verified'
                        ? 'Your account is fully verified. You have access to all features.'
                        : 'Complete your identity verification to unlock higher limits and full features.'}
                </Text>

                {status !== 'verified' && (
                    <TouchableOpacity style={styles.actionButton} onPress={onStartVerification}>
                        <Text style={styles.actionButtonText}>
                            {status === 'failed' ? 'Retry Verification' : 'Start Verification'}
                        </Text>
                        <ChevronRight size={20} color={DefaultColors.white} />
                    </TouchableOpacity>
                )}

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Why verify?</Text>
                    <View style={styles.benefitItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.benefitText}>Increase withdrawal limits</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.benefitText}>Secure your account</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.benefitText}>Compliance with financial regulations</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: DefaultColors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconContainer: {
        marginRight: 16,
    },
    statusInfo: {
        flex: 1,
    },
    statusLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 4,
        fontWeight: '600',
    },
    statusText: {
        color: DefaultColors.white,
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: DefaultColors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
    },
    actionButtonText: {
        color: DefaultColors.white,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    infoSection: {
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#888',
        marginRight: 10,
    },
    benefitText: {
        fontSize: 13,
        color: '#555',
    },
});
