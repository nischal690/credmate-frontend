'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/AppBar';
import NewsCarousel from '@/components/NewsCarousel';
import CreditScoreContainer from '@/components/CreditScoreContainer';
import CreditMetricsGrid from '@/components/CreditMetricsGrid';
import RecentActivity from '@/components/RecentActivity';
import NavBar from '@/components/NavBar';
import LoanApplication from '@/components/LoanApplication';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  const { userProfile, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    const hasSeenOnboarding = document.cookie.includes(
      'hasSeenOnboarding=true'
    );

    if (!hasSeenOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (!userProfile && !isLoading) {
      router.replace('/auth/phone');
    }
  }, [userProfile, isLoading, router]);

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <AppBar />

      <main className='flex-1 overflow-y-auto'>
        <div className='min-h-full px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50'>
          <div className='max-w-md mx-auto'>
            {isLoading ? (
              <div className='flex justify-center items-center min-h-[200px]'>
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className='text-center text-red-500'>{error}</div>
            ) : (
              <>
                <NewsCarousel />
                <CreditScoreContainer />
                <CreditMetricsGrid />
                <LoanApplication />
                <RecentActivity />
              </>
            )}
          </div>
        </div>
      </main>

      <NavBar />
    </div>
  );
}
