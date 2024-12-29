// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileData, UserPlan, VerificationType } from '@/types/profile';
import { getProfileData, updateProfileData } from '@/lib/api/getProfileData';
import { createInitialProfileState } from '@/lib/utils';
import { KYCService } from '@/lib/api/services/kycService';

export function useProfile(uid: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>(
    createInitialProfileState()
  );
  const [profileImageUrl, setProfileImageUrl] = useState('/default-avatar.png');
  const [verificationInProgress, setVerificationInProgress] =
    useState<VerificationType | null>(null);

  const router = useRouter();

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getProfileData(uid);
        const baseState = createInitialProfileState();

        const updatedData: ProfileData = {
          // Core user data from login
          id: data.id || baseState.id,
          name: data.name || baseState.name,
          email: data.email || baseState.email,
          phoneNumber: data.phoneNumber || baseState.phoneNumber,
          date_of_birth: data.date_of_birth || baseState.date_of_birth,
          businessType: data.businessType || baseState.businessType,
          profileImageUrl: data.profileImageUrl || baseState.profileImageUrl,
          aadhaarNumber: data.aadhaarNumber || baseState.aadhaarNumber,
          panNumber: data.panNumber || baseState.panNumber,
          plan: (data.plan as UserPlan) || baseState.plan,
          planPrice: data.planPrice || baseState.planPrice,
          referralCode: data.referralCode || baseState.referralCode,
          status: (data.status as 'ACTIVE' | 'INACTIVE') || baseState.status,
          metadata: data.metadata || baseState.metadata,
          createdAt: data.createdAt || baseState.createdAt,
          updatedAt: data.updatedAt || baseState.updatedAt,

          // Verification states
          verifications: {
            aadhar: { status: 'not_started' },
            pan: { status: 'not_started' },
            gst: { status: 'not_started' },
          },
        };

        setProfileData(updatedData);
        if (data.profileImageUrl) {
          setProfileImageUrl(data.profileImageUrl);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch profile data'
        );
        if ((err as any)?.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchProfileData();
    }
  }, [uid, router]);

  // Profile update handlers
  const handleSave = async () => {
    try {
      const apiData = {
        ...profileData,
      };
      await updateProfileData(uid, apiData);
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
          documentNumber = profileData.aadhaarNumber || '';
          break;
        case 'pan':
          documentNumber = profileData.panNumber || '';
          break;
        case 'gst':
          documentNumber = profileData.gstNo || '';
          break;
      }

      if (!documentNumber) {
        throw new Error(`Please enter ${type.toUpperCase()} number first`);
      }

      if (!KYCService.validateDocument(type, documentNumber)) {
        throw new Error(`Invalid ${type.toUpperCase()} number format`);
      }

      setVerificationInProgress(type);

      setProfileData((prev) => ({
        ...prev,
        verifications: {
          ...prev.verifications,
          [type]: {
            status: 'pending' as const,
            lastAttempt: new Date().toISOString(),
          },
        },
      }));

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

      setProfileData((prev) => ({
        ...prev,
        verifications: {
          ...prev.verifications,
          [type]: {
            status: result.status,
            lastAttempt: new Date().toISOString(),
            message: result.message,
          },
        },
      }));

      return { success: result.success, message: result.message };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Verification failed';

      setProfileData((prev) => ({
        ...prev,
        verifications: {
          ...prev.verifications,
          [type]: {
            status: 'failed' as const,
            lastAttempt: new Date().toISOString(),
            message: errorMessage,
          },
        },
      }));

      return { success: false, message: errorMessage };
    } finally {
      setVerificationInProgress(null);
    }
  };

  return {
    profileData,
    setProfileData,
    profileImageUrl,
    setProfileImageUrl,
    isEditing,
    setIsEditing,
    loading,
    error,
    verificationInProgress,
    handleSave,
    handleVerify,
  };
}
