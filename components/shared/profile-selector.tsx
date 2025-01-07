'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import Image from 'next/image';
import { StyledTextField } from './styled-text-field';
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Profile } from '@/types/loan';
import { ProfileCard } from './profile-card';
import { WarningMessage } from './warning-message';

interface ProfileSelectorProps {
  type: 'borrower' | 'lender';
  savedProfiles: Profile[];
  onProfileSelect: (profile: Profile | null) => void;
  onMobileNumberSubmit: (mobile: string) => void;
}

export function ProfileSelector({
  type,
  savedProfiles,
  onProfileSelect,
  onMobileNumberSubmit,
}: ProfileSelectorProps) {
  const [requestType, setRequestType] = useState('saved');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequestType(event.target.value);
    setSelectedProfile(null);
    setMobileNumber('');
    onProfileSelect(null);
  };

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    onProfileSelect(profile);
  };

  const handleMobileNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const cleanNumber = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setMobileNumber(cleanNumber);
    setWarningMessage(null);
    setIsSuccess(false);

    if (cleanNumber.length === 10) {
      onMobileNumberSubmit(cleanNumber);
    }
  };

  return (
    <div className='p-6 mb-6 bg-white shadow-lg rounded-3xl'>
      <h2 className='mb-6 text-2xl font-bold text-center text-gray-800'>
        {type === 'borrower' ? 'Select Borrower' : 'Select Lender'}
      </h2>

      <RadioGroup
        value={requestType}
        onChange={handleRequestTypeChange}
        className='mb-6'
      >
        <div className='grid grid-cols-2 gap-4'>
          <motion.div whileTap={{ scale: 0.98 }}>
            <FormControlLabel
              value='saved'
              control={<Radio />}
              label={
                <div className='flex flex-col items-center p-4 bg-pink-50 rounded-xl cursor-pointer transition-all hover:bg-pink-100 min-h-[120px] w-full justify-center'>
                  <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 bg-pink-200 rounded-full'>
                    <Image
                      src={
                        type === 'borrower'
                          ? '/images/savedborrowers.svg'
                          : '/images/savedlenders.svg'
                      }
                      alt='Saved Profiles'
                      width={32}
                      height={32}
                      className='mt-2 mb-2'
                    />
                  </div>
                  <span className='font-medium text-gray-800'>
                    Saved {type === 'borrower' ? 'Borrowers' : 'Lenders'}
                  </span>
                </div>
              }
              className='w-full m-0'
            />
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <FormControlLabel
              value='new'
              control={<Radio />}
              label={
                <div className='flex flex-col items-center p-4 bg-pink-50 rounded-xl cursor-pointer transition-all hover:bg-pink-100 min-h-[120px] w-full justify-center'>
                  <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 bg-pink-200 rounded-full'>
                    <Image
                      src='/images/newprofile.svg'
                      alt='New Profile'
                      width={32}
                      height={32}
                      className='mt-1 mb-2'
                    />
                  </div>
                  <span className='font-medium text-gray-800'>
                    New {type === 'borrower' ? 'Borrower' : 'Lender'}
                  </span>
                </div>
              }
              className='w-full m-0'
            />
          </motion.div>
        </div>
      </RadioGroup>

      <AnimatePresence mode='wait'>
        {requestType === 'saved' ? (
          <motion.div
            key='saved'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className='space-y-4'>
              {savedProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isSelected={selectedProfile?.id === profile.id}
                  onClick={() => handleProfileSelect(profile)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='new'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StyledTextField
              fullWidth
              label='Mobile Number'
              variant='outlined'
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              placeholder='Enter 10-digit number'
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
              }}
              className='mb-4'
            />
            {warningMessage && (
              <WarningMessage message={warningMessage} isSuccess={isSuccess} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
