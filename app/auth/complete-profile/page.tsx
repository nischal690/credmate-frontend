'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { getValidAccessToken } from '@/utils/auth';
import { useUser } from '../../../contexts/UserContext';

const businessTypes = [
  'Individual',
  'Proprietorship',
  'Partnership',
  'Private Limited',
  'Public Limited',
  'LLP',
  'Other',
];

// Function to validate if user is at least 18 years old
const isValidAge = (dateOfBirth: string): boolean => {
  if (!dateOfBirth) return false;

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 18;
};

const inputVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.5 },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const { refreshProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [faceDetectionLoading, setFaceDetectionLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    dateOfBirth: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        setError('Loading face detection models...');

        // Load only the tiny face detector model
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

        setModelsLoaded(true);
        setError('');
        console.log('Face detection models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError(
          'Failed to load face detection. Please refresh the page and try again.'
        );
      }
    };

    if (!modelsLoaded) {
      loadModels();
    }
  }, [modelsLoaded]);

  const detectFaces = async (imageUrl: string): Promise<boolean> => {
    if (!modelsLoaded) {
      setError(
        'Face detection is initializing. Please wait a moment and try again.'
      );
      return false;
    }

    try {
      setFaceDetectionLoading(true);
      setError('Analyzing image...');

      // Create an HTML image element
      const img = document.createElement('img');
      img.src = imageUrl;

      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Use tiny face detector with custom parameters
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.3,
      });

      // Detect faces
      const detections = await faceapi.detectAllFaces(img, options);

      if (!detections || detections.length === 0) {
        setError(
          'No face detected in the image. Please upload a clear photo of your face.'
        );
        setProfilePicture(null);
        setPreviewUrl('');
        return false;
      }

      if (detections.length > 1) {
        setError(
          'Multiple faces detected. Please upload a photo with only your face.'
        );
        setProfilePicture(null);
        setPreviewUrl('');
        return false;
      }

      const detection = detections[0];
      if (detection.score < 0.3) {
        setError(
          'Face not clearly visible. Please upload a clearer photo with good lighting.'
        );
        setProfilePicture(null);
        setPreviewUrl('');
        return false;
      }

      setError('');
      return true;
    } catch (err) {
      console.error('Face detection error:', err);
      setError('Failed to process the image. Please try again.');
      return false;
    } finally {
      setFaceDetectionLoading(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      try {
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageUrl = reader.result as string;

          if (!modelsLoaded) {
            setError(
              'Face detection is not ready yet. Please try again in a moment.'
            );
            return;
          }

          const isValidFace = await detectFaces(imageUrl);
          if (isValidFace) {
            setPreviewUrl(imageUrl);
            setProfilePicture(file);
            setError('');
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process the image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!profilePicture) {
      setError('Please upload a profile picture');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    if (!isValidAge(formData.dateOfBirth)) {
      setError('You must be at least 18 years old');
      return;
    }

    // Validate file size and type
    if (profilePicture.size > 2 * 1024 * 1024) {
      // 2MB limit
      setError('Profile picture must be less than 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(profilePicture.type)) {
      setError('Please upload a JPG or PNG image');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Get the Firebase ID token using the utility function
      const firebaseIdToken = await getValidAccessToken();

      if (!firebaseIdToken) {
        throw new Error('Firebase ID token not found');
      }

      console.log(
        'Firebase ID Token (first 10 chars):',
        firebaseIdToken.substring(0, 10) + '...'
      );

      // Create FormData instance for multipart/form-data
      const formDataToSend = new FormData();

      // Optional fields
      if (formData.name.trim()) {
        formDataToSend.append('name', formData.name.trim());
      }
      if (formData.dateOfBirth) {
        // Convert date to ISO string with time set to midnight UTC
        const date = new Date(formData.dateOfBirth);
        date.setUTCHours(0, 0, 0, 0);
        formDataToSend.append('date_of_birth', date.toISOString());
      }
      if (formData.businessType.trim()) {
        formDataToSend.append('businessType', formData.businessType);
      }

      // Append file with specific filename
      if (profilePicture) {
        // Create a new filename with timestamp to avoid conflicts
        const fileExtension = profilePicture.name.split('.').pop();
        const newFileName = `profile_${Date.now()}.${fileExtension}`;
        const newFile = new File([profilePicture], newFileName, {
          type: profilePicture.type,
        });
        formDataToSend.append('profileImage', newFile);
      }

      // Log request details
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/updateprofile`;
      console.log('\n=== API Request Details ===');
      console.log('URL:', apiUrl);
      console.log('Method:', 'POST');
      console.log('Headers:', {
        Authorization: `Bearer ${firebaseIdToken.substring(0, 10)}...`,
      });

      console.log('\nForm Data Contents:');
      const formDataLog: Record<string, any> = {};
      for (let [key, value] of formDataToSend.entries()) {
        if (key === 'profileImage') {
          const file = value as File;
          formDataLog[key] = {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`,
          };
        } else {
          formDataLog[key] = value;
        }
      }
      console.log(JSON.stringify(formDataLog, null, 2));

      alert(
        `Sending POST request to: ${apiUrl}\n\nForm Data: ${JSON.stringify(formDataLog, null, 2)}`
      );

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${firebaseIdToken}`, // Correctly formatted Bearer token
          // Remove Content-Type header to let browser set it with boundary
        },
        body: formDataToSend,
      });

      console.log('\n=== API Response Details ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Response Headers:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length'),
      });

      let responseData;
      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed Response Data:', responseData);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        responseData = { message: 'Invalid server response' };
      }

      if (response.status === 201) {
        // Refresh the user profile data
        await refreshProfile();
        alert('Profile updated successfully! Redirecting to homepage...');
        // Redirect to home page on success
        router.push('/');
      } else {
        const errorMsg = responseData?.message || 'Failed to update profile';
        alert(
          `Error: ${errorMsg}\nStatus: ${response.status}\nResponse: ${responseText}`
        );
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      console.error('Profile update error:', {
        message: err.message,
        stack: err.stack,
        error: err,
      });
      alert(`Error updating profile: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-pink-50 to-neutral-100 fixed inset-0'>
      {/* Scrollable container */}
      <div className='absolute inset-0 overflow-auto'>
        <div className='min-h-full w-full flex flex-col items-center justify-start py-8 md:py-12 px-4 md:px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='w-full max-w-md mb-8'
          >
            <motion.div
              className='text-center mb-8'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className='text-3xl font-bold text-neutral-800 mb-2 bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Complete Your Profile
              </motion.h1>
              <motion.p
                className='text-neutral-600'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Let's make your profile stand out
              </motion.p>
            </motion.div>

            <motion.div
              className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 mb-4 relative'
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm'
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <motion.div
                  className='flex flex-col items-center'
                  variants={inputVariants}
                  custom={0}
                >
                  <div
                    onClick={handleProfilePictureClick}
                    className={`relative w-32 h-32 rounded-full cursor-pointer group overflow-hidden border-2 border-dashed transition-all duration-300 hover:scale-105 ${error.includes('face') ? 'border-red-400 hover:border-red-500' : 'border-neutral-300 hover:border-pink-500'}`}
                  >
                    {previewUrl ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='w-full h-full relative'
                      >
                        <img
                          src={previewUrl}
                          alt='Profile Preview'
                          className='w-full h-full object-cover rounded-full'
                        />
                        {faceDetectionLoading && (
                          <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full'>
                            <div className='w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2' />
                            <span className='text-white text-xs px-2 text-center'>
                              Analyzing image...
                            </span>
                          </div>
                        )}
                        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                          <span className='text-white text-sm font-medium'>
                            Change Photo
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className='absolute inset-0 flex flex-col items-center justify-center text-neutral-400 group-hover:text-pink-500 transition-colors duration-300'>
                        {!modelsLoaded ? (
                          <>
                            <div className='w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-2' />
                            <span className='text-xs text-center px-2'>
                              Loading face detection...
                            </span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                className='w-8 h-8 mb-2'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                                />
                              </svg>
                            </motion.div>
                            <span className='text-xs text-center px-2'>
                              Upload Profile Picture
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                    disabled={!modelsLoaded}
                  />
                  <motion.p
                    className={`mt-2 text-sm ${error ? 'text-red-500 font-medium' : 'text-neutral-500'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {error || 'Click to upload (max 5MB)'}
                  </motion.p>
                </motion.div>

                <motion.div variants={inputVariants} custom={1}>
                  <label
                    htmlFor='name'
                    className='block text-sm font-semibold text-neutral-700 mb-2'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full h-12 px-4 rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring focus:ring-pink-200 transition-all duration-200 bg-white/70 backdrop-blur'
                    placeholder='Enter your full name'
                  />
                </motion.div>

                <motion.div variants={inputVariants} custom={2}>
                  <label
                    htmlFor='dateOfBirth'
                    className='block text-sm font-semibold text-neutral-700 mb-2'
                  >
                    Date of Birth
                  </label>
                  <input
                    type='date'
                    id='dateOfBirth'
                    name='dateOfBirth'
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className='w-full h-12 px-4 rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring focus:ring-pink-200 transition-all duration-200 bg-white/70 backdrop-blur'
                  />
                  <motion.p
                    className='mt-1 text-sm text-neutral-500'
                    variants={inputVariants}
                    custom={2.2}
                  >
                    You must be at least 18 years old
                  </motion.p>
                </motion.div>

                <motion.div variants={inputVariants} custom={3}>
                  <label
                    htmlFor='businessType'
                    className='block text-sm font-semibold text-neutral-700 mb-2'
                  >
                    Business Type
                  </label>
                  <select
                    id='businessType'
                    name='businessType'
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className='w-full h-12 px-4 rounded-xl border border-neutral-200 focus:border-pink-500 focus:ring focus:ring-pink-200 transition-all duration-200 bg-white/70 backdrop-blur appearance-none'
                  >
                    <option value=''>Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.button
                  type='submit'
                  disabled={
                    loading ||
                    !formData.name.trim() ||
                    !formData.businessType ||
                    !formData.dateOfBirth ||
                    !isValidAge(formData.dateOfBirth) ||
                    !profilePicture
                  }
                  className='w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 shadow-lg hover:shadow-xl disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'
                  variants={inputVariants}
                  custom={4}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
