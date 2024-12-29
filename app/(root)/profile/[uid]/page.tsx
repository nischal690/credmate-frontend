'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Profile from '@/components/profile/Profile';
import NavBar from '@/components/NavBar';
import { auth } from '@/lib/firebase';
import apiService from '@/lib/api/apiService';
import { User } from 'firebase/auth';
import { UserPlan } from '@/types/profile';

interface UserPlanResponse {
  plan: UserPlan;
}

export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('FREE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndPlan = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              // Use your ApiService to fetch the user plan
              const { plan } =
                await apiService.get<UserPlanResponse>('/user/plan');
              setUserPlan(plan);
            } catch (error) {
              console.error('Error fetching user plan:', error);
              setUserPlan('FREE'); // Fallback to FREE plan on error
            }
          } else {
            setUser(null);
            setUserPlan('FREE');
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Auth error:', error);
        setLoading(false);
      }
    };

    checkAuthAndPlan();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this profile.</div>;
  }

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <main className='flex-1 overflow-y-auto'>
        <div className='min-h-full px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50'>
          <div className='max-w-md mx-auto'>
            <Profile uid={params.uid as string} userPlan={userPlan} />
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  );
}
