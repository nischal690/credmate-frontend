import { ProfileData } from '@/types/profile';
import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';

interface ProfileInfoProps {
  profileData: ProfileData;
  showStatus?: boolean;
}

export function ProfileInfo({
  profileData,
  showStatus = false,
}: ProfileInfoProps) {
  const quickInfo = [
    { icon: MapPin, value: profileData.address },
    { icon: Mail, value: profileData.email },
    { icon: Phone, value: profileData.phoneNumber },
    { icon: Briefcase, value: 'Business Profile' },
  ];

  return (
    <div className='mb-8'>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold text-transparent bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text'>
          {profileData.name}
        </h2>
        <p className='mt-2 text-gray-500'>{profileData.bio}</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {quickInfo.map(({ icon: Icon, value }, index) => (
          <div
            key={index}
            className='flex items-center space-x-2 overflow-hidden text-gray-600'
          >
            <Icon className='flex-shrink-0 text-pink-500' size={18} />
            <span className='text-sm truncate'>{value}</span>
          </div>
        ))}
      </div>

      {showStatus && profileData.status && (
        <div className='mt-4 text-center'>
          <span className='text-sm font-medium text-gray-500'>Status: </span>
          <span className='text-sm text-gray-900'>{profileData.status}</span>
        </div>
      )}
    </div>
  );
}
