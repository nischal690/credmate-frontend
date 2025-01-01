'use client';

import { VerificationType } from '@/types/profile';
import { VERIFICATION_TYPES } from '@/constants';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { SnackbarNotification } from '@/components/ui/SnackbarNotification';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { VerificationSection } from './VerificationSection';

interface ProfileProps {
  uid: string;
}

export default function Profile({ uid }: ProfileProps) {
  const { userProfile, refreshProfile, isLoading: contextLoading } = useUser();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info'
  >('success');
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const {
    profileImageUrl,
    setProfileImageUrl,
    isEditing,
    setIsEditing,
    verificationInProgress,
    handleSave,
    handleVerify,
  } = useProfile(uid);

  const router = useRouter();

  if (contextLoading || !userProfile) {
    return (
      <div className='container py-8 mx-auto'>
        <Card>
          <CardContent>
            <div className='w-full h-4 bg-gray-200 rounded'>
              <div
                className='h-full bg-blue-500 rounded animate-pulse'
                style={{ width: '50%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSnackbarClose = () => setShowSnackbar(false);
  const handleEdit = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const result = await handleSave();
    setSnackbarMessage(result.message);
    setSnackbarSeverity(result.success ? 'success' : 'error');
    setShowSnackbar(true);
  };

  const handleVerifyClick = async (type: VerificationType) => {
    const result = await handleVerify(type);
    setSnackbarMessage(result.message);
    setSnackbarSeverity(result.success ? 'success' : 'error');
    setShowSnackbar(true);
  };

  const handleUpgrade = () => router.push('/upgrade');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100'>
      <ProfileHeader
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSaveClick}
      />

      <div className='max-w-3xl px-4 pt-24 pb-24 mx-auto'>
        <div className='relative'>
          <div className='h-40 rounded-t-3xl bg-gradient-to-r from-pink-400 to-pink-600' />

          <div className='absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2'>
            <div
              className='relative w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-xl'
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <Avatar className='w-full h-full'>
                <AvatarImage src={profileImageUrl} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <input
                accept='image/*'
                type='file'
                id='image-upload'
                hidden
                onChange={handleImageUpload}
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 ${
                  isHoveringImage ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-white transition-all ease-in hover:bg-pink-500/20 hover:text-white'
                  onClick={() =>
                    document.getElementById('image-upload')?.click()
                  }
                >
                  <Camera className='w-4 h-4 mr-2' />
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          <Card className='mt-16 shadow-lg'>
            <CardContent className='p-6'>
              <ProfileInfo profileData={userProfile} />

              {!isEditing ? (
                <div className='mt-6 space-y-4'>
                  {VERIFICATION_TYPES.map(({ type, label, getValue }) => (
                    <VerificationSection
                      key={type}
                      type={type}
                      label={label}
                      value={getValue(userProfile)}
                      userPlan={userProfile.plan}
                      onVerify={handleVerifyClick}
                      onUpgrade={handleUpgrade}
                      isLoading={verificationInProgress === type}
                      verificationState={userProfile.verifications?.[type]}
                    />
                  ))}
                </div>
              ) : (
                <ProfileForm
                  profileData={userProfile}
                  onChange={async (field, value) => {
                    await refreshProfile();
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SnackbarNotification
        open={showSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
}
