import React from 'react';
import { TextField } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { ProfileData } from '@/lib/api/getProfileData';

interface ProfileFormProps {
  profileData: ProfileData;
  onFieldChange: (
    field: keyof ProfileData
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileForm = ({
  profileData,
  onFieldChange,
}: ProfileFormProps) => (
  <div className='mb-6'>
    <h3 className='mb-4 text-lg font-semibold text-gray-700'>
      Personal Information
    </h3>
    {Object.entries(profileData)
      .filter(([field]) => !['aadharNo', 'panNo'].includes(field))
      .map(([field, value]) => (
        <div key={field} className='mb-4 space-y-2'>
          <label className='flex items-center space-x-2 text-sm font-medium text-gray-500 capitalize'>
            {field === 'address' && (
              <LocationOnIcon className='w-4 h-4 text-pink-400' />
            )}
            {field === 'email' && (
              <EmailIcon className='w-4 h-4 text-pink-400' />
            )}
            {field === 'phone' && (
              <PhoneIcon className='w-4 h-4 text-pink-400' />
            )}
            {field === 'name' && (
              <PersonIcon className='w-4 h-4 text-pink-400' />
            )}
            <span>{field}</span>
          </label>
          <TextField
            fullWidth
            value={value}
            onChange={onFieldChange(field as keyof ProfileData)}
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: '#EC4899',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#EC4899',
                },
                '& fieldset': {
                  borderColor: '#f3f4f6',
                },
              },
              '& .MuiInputBase-input': {
                padding: '12px 16px',
              },
            }}
            multiline={field === 'bio'}
            rows={field === 'bio' ? 4 : 1}
            className='shadow-sm'
          />
        </div>
      ))}
  </div>
);
