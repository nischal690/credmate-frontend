import { VerificationType, VerificationState } from '@/types/profile';

export interface KYCApiResponse {
  message: string;
  verificationId?: string;
  status: VerificationState['status'];
  documentUrl?: string;
  data?: {
    documentNumber?: string;
    verificationDate?: string;
    issuingAuthority?: string;
    [key: string]: any; // For any additional fields
  };
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  verificationId?: string;
  status: VerificationState['status'];
  documentUrl?: string;
}

export interface VerificationPayload {
  userId: string;
  documentNumber: string;
  documentType: VerificationType;
}

export interface VerificationStatusResponse {
  status: VerificationState['status'];
  message: string;
  documentUrl?: string;
  lastUpdated?: string;
  data?: {
    [key: string]: any;
  };
}
