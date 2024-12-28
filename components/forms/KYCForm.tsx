import React from 'react';
import { TextField } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import { ProfileData } from '@/lib/api/getProfileData';

interface KYCFormProps {
  profileData: ProfileData;
  onFieldChange: (
    field: keyof ProfileData
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const KYCForm = ({ profileData, onFieldChange }: KYCFormProps) => (
  <>
    <div className='mb-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-700'>
        KYC Information
      </h3>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <label className='flex items-center space-x-2 text-sm font-medium text-gray-500'>
            <BadgeIcon className='w-4 h-4 text-pink-400' />
            <span>Aadhar Number</span>
            <span className='text-xs text-pink-500'>*Required</span>
          </label>
          <TextField
            fullWidth
            value={profileData.aadharNo}
            onChange={onFieldChange('aadharNo')}
            variant='outlined'
            placeholder='XXXX-XXXX-XXXX'
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: '#EC4899',
                  borderWidth: '2px',
                },
              },
            }}
          />
        </div>

        <div className='space-y-2'>
          <label className='flex items-center space-x-2 text-sm font-medium text-gray-500'>
            <CreditCardIcon className='w-4 h-4 text-pink-400' />
            <span>PAN Number</span>
            <span className='text-xs text-pink-500'>*Required</span>
          </label>
          <TextField
            fullWidth
            value={profileData.panNo}
            onChange={onFieldChange('panNo')}
            variant='outlined'
            placeholder='XXXXXXXXXX'
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: '#EC4899',
                  borderWidth: '2px',
                },
              },
            }}
          />
        </div>
      </div>
    </div>

    <div className='flex items-start p-4 space-x-3 rounded-lg bg-pink-50'>
      <SecurityIcon className='flex-shrink-0 mt-1 text-pink-500' />
      <div>
        <h4 className='text-sm font-medium text-gray-700'>
          Data Protection Notice
        </h4>
        <p className='mt-1 text-xs text-gray-500'>
          Your personal and KYC information is encrypted and securely stored. We
          comply with all data protection regulations and never share your
          information without consent.
        </p>
      </div>
    </div>
  </>
);
