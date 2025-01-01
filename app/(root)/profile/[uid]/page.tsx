'use client';

import NavBar from '@/components/NavBar';
import Profile from '@/components/profile/Profile';
import { useUser } from '@/contexts/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { userProfile, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && userProfile?.id !== params.uid) {
      router.replace('/');
    }
  }, [userProfile, isLoading, params.uid, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <main className='flex-1 overflow-y-auto'>
        <div className='min-h-full px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50'>
          <div className='max-w-md mx-auto'>
            <Profile uid={params.uid as string} />
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
}
