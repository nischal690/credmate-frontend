import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { VerificationType } from '@/types/profile';
import { KYCService } from '@/lib/api/services/kycService';
import { updateProfileData } from '@/lib/api/getProfileData';

export function useProfile(uid: string) {
  const { userProfile, refreshProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    userProfile?.profileImageUrl || ''
  );
  const [verificationInProgress, setVerificationInProgress] =
    useState<VerificationType | null>(null);

  const handleSave = async () => {
    try {
      if (!userProfile) {
        return { success: false, message: 'No profile data available' };
      }
      await updateProfileData(uid, userProfile);
      await refreshProfile();
      setIsEditing(false);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const handleVerify = async (type: VerificationType) => {
    try {
      let documentNumber = '';
      switch (type) {
        case 'aadhar':
          documentNumber = userProfile?.aadhaarNumber || '';
          break;
        case 'pan':
          documentNumber = userProfile?.panNumber || '';
          break;
        case 'gst':
          documentNumber = userProfile?.gstNo || '';
          break;
      }

      if (!documentNumber) {
        throw new Error(`Please enter ${type.toUpperCase()} number first`);
      }

      if (!KYCService.validateDocument(type, documentNumber)) {
        throw new Error(`Invalid ${type.toUpperCase()} number format`);
      }

      setVerificationInProgress(type);
      const result = await KYCService.verifyDocument(type, uid, documentNumber);

      if (result.verificationId) {
        const finalResult = await KYCService.checkVerificationStatus(
          type,
          result.verificationId
        );
        if (finalResult.success) {
          result.status = finalResult.status;
          result.message = finalResult.message;
        }
      }

      await refreshProfile();
      return { success: result.success, message: result.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Verification failed',
      };
    } finally {
      setVerificationInProgress(null);
    }
  };

  return {
    profileData: userProfile,
    profileImageUrl,
    setProfileImageUrl,
    isEditing,
    setIsEditing,
    loading: false,
    error: null,
    verificationInProgress,
    handleSave,
    handleVerify,
  };
}
