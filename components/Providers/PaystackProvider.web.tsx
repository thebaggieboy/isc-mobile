import React from 'react';

interface Props {
    publicKey: string;
    children: React.ReactNode;
}

export const PaystackProvider = ({ children }: Props) => {
    return <>{children}</>;
};
