'use client';

import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className }: NavBarProps) {
  const pathname = usePathname();
  const { userProfile, isLoading } = useUser();

  const profilePath = userProfile?.id ? `/profile/${userProfile.id}` : '/';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className || ''}`}>
      <div className='border-t bg-white/80 backdrop-blur-lg border-neutral-100'>
        <div className='h-20 max-w-md px-6 mx-auto'>
          <div className='flex items-center justify-between h-full'>
            <NavItem
              href='/'
              imageSrc='/images/Home.svg'
              alt='Home'
              label='Home'
              isActive={pathname === '/'}
            />
            <NavItem
              href='/search-profile'
              imageSrc='/images/Loans.svg'
              alt='Search Profile'
              label='Search Profile'
              isActive={pathname === '/search-profile'}
            />
            <NavItem
              href='/history'
              imageSrc='/images/Timeline.svg'
              alt='History'
              label='History'
              isActive={pathname === '/history'}
            />
            <NavItem
              href={isLoading ? '/' : profilePath}
              imageSrc='/images/Profile.svg'
              alt='Profile'
              label='Profile'
              isActive={pathname.startsWith('/profile')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  imageSrc: string;
  alt: string;
  label: string;
  isActive: boolean;
}

function NavItem({ href, imageSrc, alt, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
        isActive
          ? 'text-pink-600 scale-105'
          : 'text-neutral-400 hover:text-pink-600'
      }`}
    >
      <div className='flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-pink-50 to-white'>
        <Image
          src={imageSrc}
          alt={alt}
          width={24}
          height={24}
          className={isActive ? 'opacity-100' : 'opacity-70'}
        />
      </div>
      <span className='text-xs font-medium'>{label}</span>
    </Link>
  );
}
