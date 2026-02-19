// services/api/kyc.service.ts
import { api } from './index';

export interface KycStatus {
    kycStatus: 'pending' | 'verified' | 'failed' | 'not_started';
    isVerified: boolean;
}

export const kycService = {
    getKycStatus: async (): Promise<KycStatus> => {
        const response = await api.get('/kyc/status');
        return response.data;
    },

    initiateKYC: async (jobType: string = 'biometric_kyc'): Promise<any> => {
        const response = await api.post('/kyc/initiate', { jobType });
        return response.data;
    },

    simulateSuccess: async (): Promise<any> => {
        const response = await api.post('/kyc/simulate-success', {});
        return response.data;
    }
};
