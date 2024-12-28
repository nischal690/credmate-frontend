'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../lib/api/config';
import apiService from '../lib/api/apiService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchAndStoreSavedProfiles } from '../utils/api';
import { getProfileData } from '@/lib/api/getProfileData';

interface UserProfile {
  [key: string]: any;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  refreshSavedProfiles: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'user_profile';
const PROFILE_TIMESTAMP_KEY = 'profile_last_fetched';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Getting fresh ID token for user:', user.uid);
      console.log('User phone number:', user.phoneNumber);
      console.log('User metadata:', user.metadata);

      const idToken = await user.getIdToken(true);
      console.log(
        'Got fresh ID token, first 10 chars:',
        idToken.substring(0, 10)
      );

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
        console.error(
          'Profile fetch failed:',
          response.status,
          response.statusText
        );
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const shouldFetchProfile = () => {
    const lastFetched = localStorage.getItem(PROFILE_TIMESTAMP_KEY);
    if (!lastFetched) return true;

    const timeSinceLastFetch = Date.now() - parseInt(lastFetched);
    return timeSinceLastFetch > CACHE_DURATION;
  };

  const refreshProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user, clearing profile');
        setUserProfile(null);
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Then try to get a fresh token
      try {
        await user.getIdToken(true);
      } catch (tokenError) {
        console.error('Error refreshing token:', tokenError);
        // Don't throw here, let's try to use the existing token
      }

      console.log('Fetching profile data...');
      const data = await fetchProfile();
      console.log('Fetched profile data:', data);

      if (data) {
        console.log('Setting user profile in state and localStorage');
        setUserProfile(data);

        // Save to localStorage
        const dataString = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, dataString);
        localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());

        // Log localStorage contents for debugging
        console.log(
          'All localStorage contents:',
          Object.fromEntries(
            Object.keys(localStorage).map((key) => [
              key,
              localStorage.getItem(key),
            ])
          )
        );
      } else {
        console.log('No profile data received from API');
        setUserProfile(null);
        localStorage.setItem(STORAGE_KEY, 'null');
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
      // Only set error, don't clear profile data
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

  // Listen for auth state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const data = await getProfileData(firebaseUser.uid);
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
