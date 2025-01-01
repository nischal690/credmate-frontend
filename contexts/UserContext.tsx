'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchAndStoreSavedProfiles } from '../utils/api';
import { getProfileData } from '@/lib/api/getProfileData';
import { ProfileData } from '@/types/profile';

interface UserContextType {
  userProfile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshSavedProfiles: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'user_profile';
const PROFILE_TIMESTAMP_KEY = 'profile_last_fetched';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper functions for localStorage
const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<ProfileData | null> => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      const idToken = await user.getIdToken(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complete-profile`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const shouldFetchProfile = () => {
    const lastFetched = storage.get(PROFILE_TIMESTAMP_KEY);
    if (!lastFetched) return true;

    const timeSinceLastFetch = Date.now() - parseInt(lastFetched);
    return timeSinceLastFetch > CACHE_DURATION;
  };

  const refreshProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setUserProfile(null);
        storage.remove(STORAGE_KEY);
        return;
      }

      const data = await fetchProfile();

      if (data) {
        setUserProfile(data);
        storage.set(STORAGE_KEY, data);
        storage.set(PROFILE_TIMESTAMP_KEY, Date.now().toString());
      } else {
        setUserProfile(null);
        storage.remove(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to fetch user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSavedProfiles = async () => {
    try {
      await fetchAndStoreSavedProfiles();
    } catch (error) {
      console.error('Error fetching saved profiles:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        'Auth state changed:',
        firebaseUser ? 'User logged in' : 'No user'
      );
      if (firebaseUser) {
        try {
          console.log('Fetching profile data for user:', firebaseUser.uid);
          const data = await getProfileData(firebaseUser.uid);
          console.log('Profile data fetched:', data);
          setUserProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isLoading,
        error,
        refreshProfile,
        refreshSavedProfiles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
