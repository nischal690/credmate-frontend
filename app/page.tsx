'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from './components/AppBar';
import NewsCarousel from './components/NewsCarousel';
import CreditScoreContainer from './components/CreditScoreContainer';
import CreditMetricsGrid from './components/CreditMetricsGrid'
import RecentActivity from './components/RecentActivity';
import NavBar from './components/NavBar';
import LoanApplication from './components/LoanApplication';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import apiService from './lib/api/apiService';
import { API_ENDPOINTS } from './lib/api/config';
import { useUser } from './contexts/UserContext';

export default function Home() {
  const { userProfile, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    const showFirebaseToken = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken(true);
          alert(idToken);
        }
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
    };

    showFirebaseToken();
  }, []);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = document.cookie.includes('hasSeenOnboarding=true');
    
    if (!hasSeenOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (!userProfile && !isLoading) {
      router.replace('/auth/phone');
      return;
    }

    console.log('Homepage useEffect running');
    console.log('Current userProfile state:', userProfile);
    
    // Log all localStorage contents
    console.log('=== All localStorage Contents ===');
    const allStorageData = Object.keys(localStorage).reduce((obj, key) => {
      try {
        const value = localStorage.getItem(key);
        obj[key] = value ? JSON.parse(value) : null;
      } catch (e) {
        obj[key] = localStorage.getItem(key); // Keep as string if can't parse JSON
      }
      return obj;
    }, {} as Record<string, any>);
    
    console.log('localStorage contents:', allStorageData);
    
    // Log specific items of interest
    console.log('=== Important Items ===');
    console.log('User Profile:', localStorage.getItem('user_profile'));
    console.log('Saved Profiles:', localStorage.getItem('savedProfiles'));
    console.log('Profile Last Fetched:', localStorage.getItem('profile_last_fetched'));

    // Log the current profile data
    const profileData = localStorage.getItem('user_profile');
    console.log('Homepage found profile data in localStorage:', profileData);

    if (profileData && profileData !== 'null') {
      try {
        const profile = JSON.parse(profileData);
        console.log('Parsed profile data:', profile);
      } catch (e) {
        console.error('Homepage error parsing profile:', e);
      }
    }
  }, [userProfile, isLoading, router]); // Re-run when userProfile changes

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                {/* Add your loading spinner component here */}
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">
                {error}
              </div>
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