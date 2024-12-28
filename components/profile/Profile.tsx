'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Snackbar,
  TextField,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { getProfileData } from '@/lib/api/getProfileData';
import { VerificationSection } from './VerificationSection';

interface ProfileProps {
  uid: string;
  userPlan: UserPlan;
}

export default function Profile({ uid, userPlan }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [profileImageUrl, setprofileImageUrl] = useState('/default-avatar.png');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    aadharNo: '',
    panNo: '',
    gstNo: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getProfileData(uid);
        setProfileData(data);
        if (data.profileImageUrl) {
          setprofileImageUrl(data.profileImageUrl);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch profile data'
        );

        // If unauthorized, redirect to login
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

  const handleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
    setShowSnackbar(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setprofileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData({
        ...profileData,
        [field]: event.target.value,
      });
    };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = () => {
    setIsSaved(!isSaved);
    setShowSnackbar(true);
  };

  const handleVerify = async (type: string) => {
    try {
      // Implement your verification flow here
      console.log(`Starting verification for ${type}`);
      // Example:
      // await verifyDocument(type, userId);
    } catch (error) {
      console.error(`Verification failed for ${type}:`, error);
    }
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Paper>
          <CardContent>
            <LinearProgress />
          </CardContent>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Paper>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Error
            </Typography>
            <Typography variant='body1' color='error'>
              {error}
            </Typography>
          </CardContent>
        </Paper>
      </Container>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100'>
      {/* Header */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <div className='border-b bg-white/80 backdrop-blur-lg border-neutral-100'>
          <div className='flex items-center justify-between h-16 max-w-md px-4 mx-auto'>
            <h1 className='text-xl font-semibold text-transparent bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text'>
              My Profile
            </h1>
            <IconButton
              onClick={isEditing ? handleSave : handleEdit}
              className={`w-10 h-10 ${isEditing ? 'text-pink-600' : 'text-gray-600'} hover:scale-105 transition-transform`}
            >
              {isEditing ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-md px-4 pt-24 pb-24 mx-auto'>
        <div className='relative'>
          {/* Banner */}
          <div className='h-40 rounded-t-3xl bg-gradient-to-r from-pink-400 to-pink-600' />

          {/* Profile Image */}
          <div className='absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2'>
            <div className='relative w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-xl'>
              <Avatar
                src={profileImageUrl}
                sx={{ width: '100%', height: '100%' }}
              />
              <input
                accept='image/*'
                type='file'
                id='image-upload'
                hidden
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className='p-6 mt-16 bg-white shadow-lg rounded-3xl'>
            <div className='mb-6 text-center'>
              <h2 className='text-2xl font-bold text-transparent bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text'>
                {profileData.name}
              </h2>
              <p className='mt-2 text-gray-500'>{profileData.bio}</p>
            </div>

            {/* Quick Info */}
            <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2'>
              {[
                { icon: LocationOnIcon, value: profileData.address },
                { icon: EmailIcon, value: profileData.email },
                { icon: PhoneIcon, value: profileData.phone },
                { icon: BusinessIcon, value: 'Business Profile' },
              ].map(({ icon: Icon, value }, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 overflow-hidden text-gray-600'
                >
                  <Icon className='flex-shrink-0 text-pink-500' />
                  <span className='text-sm truncate'>{value}</span>
                </div>
              ))}
            </div>

            {/* Verification Section */}
            {!isEditing && (
              <div className='space-y-4'>
                <VerificationSection
                  type='aadhar'
                  label='Aadhaar Verification'
                  value={profileData.aadharNo}
                  userPlan={userPlan}
                  onVerify={handleVerify}
                  onUpgrade={handleUpgrade}
                />

                <VerificationSection
                  type='pan'
                  label='PAN Verification'
                  value={profileData.panNo}
                  userPlan={userPlan}
                  onVerify={handleVerify}
                  onUpgrade={handleUpgrade}
                />

                <VerificationSection
                  type='gst'
                  label='GST Verification'
                  value={profileData.gstNo}
                  userPlan={userPlan}
                  onVerify={handleVerify}
                  onUpgrade={handleUpgrade}
                />
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div className='pt-6 mt-8 space-y-6 border-t border-pink-100'>
                {Object.entries(profileData)
                  .filter(([field]) => field !== 'profileImageUrl')
                  .map(([field, value]) => (
                    <div key={field} className='space-y-2'>
                      <label className='text-sm font-medium text-gray-500 capitalize'>
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <TextField
                        fullWidth
                        value={value}
                        onChange={handleChange(field as keyof ProfileData)}
                        variant='outlined'
                        multiline={field === 'bio'}
                        rows={field === 'bio' ? 4 : 1}
                        className='shadow-sm'
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={isEditing ? 'Profile updated successfully!' : 'Profile saved!'}
      />
    </div>
  );
}
