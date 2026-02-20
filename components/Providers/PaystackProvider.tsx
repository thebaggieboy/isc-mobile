import React from 'react';
import { PaystackProvider as OriginalPaystackProvider } from 'react-native-paystack-webview';

interface Props {
    publicKey: string;
    children: React.ReactNode;
}

export const PaystackProvider = ({ publicKey, children }: Props) => {
    return (
        <OriginalPaystackProvider publicKey={publicKey}>
            {children}
        </OriginalPaystackProvider>
    );
};
