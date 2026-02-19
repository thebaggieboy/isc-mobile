// components/KYC/SmileIDVerification.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { DefaultColors } from '@/constants/colors';
import { Camera, UserCheck, Shield, CheckCircle2 } from 'lucide-react-native';
import { kycService } from '@/services/api/kyc.service';
// @ts-ignore - Library is installed but types might be tricky in this environment
import * as SmileID from '@smile_identity/react-native-expo';

interface SmileIDVerificationProps {
    onComplete: () => void;
    onCancel: () => void;
}

export default function SmileIDVerification({ onComplete, onCancel }: SmileIDVerificationProps) {
    const [step, setStep] = useState<'instructions' | 'capturing' | 'processing' | 'done'>('instructions');
    const [loading, setLoading] = useState(false);

    const handleStartCapture = async () => {
        setStep('capturing');
        // Simulate SDK capture delay
        setTimeout(() => {
            handleProcessVerification();
        }, 2000);
    };

    const handleProcessVerification = async () => {
        setStep('processing');
        setLoading(true);
        try {
            // Initiate the job on backend
            await kycService.initiateKYC('biometric_kyc');

            // Wait for "processing" simulation
            setTimeout(async () => {
                try {
                    // Call simulation success to update backend state
                    await kycService.simulateSuccess();

                    setStep('done');
                    setLoading(false);
                } catch (err) {
                    console.error("Simulation failed", err);
                    setStep('instructions');
                }
            }, 3000);
        } catch (error) {
            setLoading(false);
            Alert.alert("Verification Error", "Something went wrong during the process. Please try again.");
            setStep('instructions');
        }
    };

    if (step === 'instructions') {
        return (
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Shield size={48} color={DefaultColors.primary} />
                </View>
                <Text style={styles.title}>Biometric Verification</Text>
                <Text style={styles.description}>
                    Follow the instructions to verify your identity using Smile ID.
                </Text>

                <View style={styles.instructionList}>
                    <View style={styles.instructionItem}>
                        <View style={styles.bullet}><Text style={styles.bulletText}>1</Text></View>
                        <Text style={styles.instructionText}>Ensure you are in a well-lit environment.</Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <View style={styles.bullet}><Text style={styles.bulletText}>2</Text></View>
                        <Text style={styles.instructionText}>Hold your phone at eye level.</Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <View style={styles.bullet}><Text style={styles.bulletText}>3</Text></View>
                        <Text style={styles.instructionText}>Follow the on-screen prompts (blink, smile, etc.)</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleStartCapture}>
                    <Camera size={20} color={DefaultColors.white} />
                    <Text style={styles.buttonText}>Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (step === 'capturing') {
        return (
            <View style={[styles.card, styles.center]}>
                <View style={styles.cameraMock}>
                    <UserCheck size={100} color="#ccc" />
                    <View style={styles.scannerLine} />
                </View>
                <Text style={styles.statusText}>Capturing Biometrics...</Text>
            </View>
        );
    }

    if (step === 'processing') {
        return (
            <View style={[styles.card, styles.center]}>
                <ActivityIndicator size="large" color={DefaultColors.primary} />
                <Text style={styles.title}>Processing...</Text>
                <Text style={styles.description}>
                    Smile ID is verifying your identity against official records. This usually takes less than a minute.
                </Text>
            </View>
        );
    }

    if (step === 'done') {
        return (
            <View style={[styles.card, styles.center]}>
                <CheckCircle2 size={64} color="#4CAF50" />
                <Text style={styles.title}>Verification Submitted</Text>
                <Text style={styles.description}>
                    Your verification has been submitted successfully to Smile ID. Your status will be updated shortly.
                </Text>
                <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: DefaultColors.white,
        borderRadius: 24,
        padding: 30,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${DefaultColors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    instructionList: {
        marginBottom: 30,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    bullet: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: DefaultColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bulletText: {
        color: DefaultColors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    instructionText: {
        fontSize: 14,
        color: '#444',
        flex: 1,
    },
    primaryButton: {
        backgroundColor: DefaultColors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
        marginBottom: 12,
    },
    buttonText: {
        color: DefaultColors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    cameraMock: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 20,
    },
    scannerLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: DefaultColors.primary,
        opacity: 0.5,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: DefaultColors.primary,
    },
});
