import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface ProfileImageProps {
  profileImage: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileImage = ({
  profileImage,
  onImageUpload,
}: ProfileImageProps) => (
  <div className='absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2'>
    <div className='relative w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-xl'>
      <Avatar
        src={profileImage}
        sx={{
          width: '100%',
          height: '100%',
        }}
      />
      <input
        accept='image/*'
        type='file'
        id='image-upload'
        hidden
        onChange={onImageUpload}
      />
      <label htmlFor='image-upload'>
        <IconButton
          component='span'
          className='absolute bottom-0 right-0 text-pink-500 transition-all bg-white/90 hover:bg-white hover:text-pink-600'
        >
          <CameraAltIcon />
        </IconButton>
      </label>
    </div>
  </div>
);
