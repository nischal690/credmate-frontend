'use client';

import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Add this

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  const pathname = usePathname();
  const { userProfile, isLoading, error } = useUser();

  // Debug logs
  console.log('Auth current user:', auth.currentUser?.uid);
  console.log('User Profile:', userProfile);
  console.log('Is Loading:', isLoading);

  // Get the profile path
  const getProfilePath = () => {
    if (isLoading) return '/profile'; // Default while loading
    if (auth.currentUser) {
      return `/profile/${auth.currentUser.uid}`;
    }
    return '/profile'; // or '/login' if you prefer
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className || ''}`}>
      <div className='border-t bg-white/80 backdrop-blur-lg border-neutral-100'>
        <div className='h-20 max-w-md px-6 mx-auto'>
          <div className='flex items-center justify-between h-full'>
            <Link
              href='/'
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}
            >
              <div className='flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-white'>
                <Image
                  src='/images/Home.svg'
                  alt='Home'
                  width={24}
                  height={24}
                  className={pathname === '/' ? 'opacity-100' : 'opacity-70'}
                />
              </div>
              <span className='text-xs font-medium'>Home</span>
            </Link>

            <Link
              href='/search-profile'
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/search-profile' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}
            >
              <div className='flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-white'>
                <Image
                  src='/images/Loans.svg'
                  alt='Search Profile'
                  width={24}
                  height={24}
                  className={
                    pathname === '/search-profile'
                      ? 'opacity-100'
                      : 'opacity-70'
                  }
                />
              </div>
              <span className='text-xs font-medium'>Search Profile</span>
            </Link>

            <Link
              href='/history'
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/history' ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}
            >
              <div className='flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-white'>
                <Image
                  src='/images/Timeline.svg'
                  alt='History'
                  width={24}
                  height={24}
                  className={
                    pathname === '/history' ? 'opacity-100' : 'opacity-70'
                  }
                />
              </div>
              <span className='text-xs font-medium'>History</span>
            </Link>

            <Link
              href={getProfilePath()}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname.startsWith('/profile') ? 'text-pink-600 scale-105' : 'text-neutral-400 hover:text-pink-600'}`}
            >
              <div className='flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-white'>
                <Image
                  src='/images/Profile.svg'
                  alt='Profile'
                  width={24}
                  height={24}
                  className={
                    pathname.startsWith('/profile')
                      ? 'opacity-100'
                      : 'opacity-70'
                  }
                />
              </div>
              <span className='text-xs font-medium'>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
