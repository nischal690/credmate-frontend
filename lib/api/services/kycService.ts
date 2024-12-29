import { API_ENDPOINTS, API_TIMEOUTS } from '@/lib/api/config';
import apiService from '@/lib/api/apiService';
import { VerificationType, VerificationState } from '@/types/profile';
import {
  KYCApiResponse,
  VerificationResponse,
  VerificationPayload,
  VerificationStatusResponse,
} from '@/types/kyc';

export class KYCService {
  private static getEndpoint(type: VerificationType): string {
    switch (type) {
      case 'aadhar':
        return API_ENDPOINTS.KYC.VERIFY_AADHAAR;
      case 'pan':
        return API_ENDPOINTS.KYC.VERIFY_PAN;
      case 'gst':
        return API_ENDPOINTS.KYC.VERIFY_GST;
      default:
        throw new Error(`Unsupported verification type: ${type}`);
    }
  }

  static async verifyDocument(
    type: VerificationType,
    userId: string,
    documentNumber: string
  ): Promise<VerificationResponse> {
    try {
      const endpoint = this.getEndpoint(type);

      const payload: VerificationPayload = {
        userId,
        documentNumber,
        documentType: type,
      };

      const response = await apiService.post<KYCApiResponse>(
        endpoint,
        payload,
        {
          timeout: API_TIMEOUTS.LONG_RUNNING,
        }
      );

      return {
        success: true,
        message: response.message,
        verificationId: response.verificationId,
        status: response.status,
        documentUrl: response.documentUrl,
      };
    } catch (error: any) {
      console.error(`KYC verification failed for ${type}:`, error);

      // Handle specific API error responses
      if (error.response?.data) {
        const errorData = error.response.data as { message?: string };
        return {
          success: false,
          message: errorData.message || 'Verification failed',
          status: 'failed' as const,
        };
      }

      // Handle network or other errors
      return {
        success: false,
        message: error.message || 'Network error during verification',
        status: 'failed' as const,
      };
    }
  }

  static async checkVerificationStatus(
    type: VerificationType,
    verificationId: string
  ): Promise<VerificationResponse> {
    try {
      const response = await apiService.get<VerificationStatusResponse>(
        `${API_ENDPOINTS.KYC.STATUS}/${verificationId}`
      );

      return {
        success: true,
        message: response.message,
        status: response.status,
        documentUrl: response.documentUrl,
      };
    } catch (error: any) {
      console.error(`Status check failed for ${type}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Status check failed',
        status: 'failed' as const,
      };
    }
  }

  // Helper method to validate document numbers
  static validateDocument(type: VerificationType, number: string): boolean {
    const validations = {
      aadhar: /^\d{12}$/, // 12 digits
      pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ABCDE1234F format
      gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // GST format
    };

    return validations[type].test(number);
  }
}
