import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

interface QuickInfoProps {
  address: string;
  email: string;
  phone: string;
}

export const QuickInfo = ({ address, email, phone }: QuickInfoProps) => (
  <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2'>
    <div className='flex items-center space-x-2 overflow-hidden text-gray-600'>
      <LocationOnIcon className='flex-shrink-0 text-pink-500' />
      <span className='text-sm truncate'>{address}</span>
    </div>
    <div className='flex items-center space-x-2 overflow-hidden text-gray-600'>
      <EmailIcon className='flex-shrink-0 text-pink-500' />
      <span className='text-sm truncate'>{email}</span>
    </div>
    <div className='flex items-center space-x-2 overflow-hidden text-gray-600'>
      <PhoneIcon className='flex-shrink-0 text-pink-500' />
      <span className='text-sm truncate'>{phone}</span>
    </div>
    <div className='flex items-center space-x-2 overflow-hidden text-gray-600'>
      <PersonIcon className='flex-shrink-0 text-pink-500' />
      <span className='text-sm truncate'>Active Member</span>
    </div>
  </div>
);
