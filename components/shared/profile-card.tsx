'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { type Profile } from '@/types/loan';

interface ProfileCardProps {
  profile: Profile;
  isSelected: boolean;
  onClick: () => void;
}

export function ProfileCard({
  profile,
  isSelected,
  onClick,
}: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-pink-500 bg-pink-50'
          : 'border-gray-200 hover:border-pink-200'
      }`}
    >
      <div className='flex items-center space-x-4'>
        <div className='w-12 h-12 overflow-hidden bg-gray-100 rounded-full'>
          <Image
            src={profile.image}
            alt={profile.name}
            width={48}
            height={48}
            className='object-cover'
          />
        </div>
        <div>
          <h3 className='font-semibold text-gray-800'>{profile.name}</h3>
          <p className='text-sm text-gray-500'>{profile.mobile}</p>
        </div>
      </div>
    </motion.div>
  );
}
