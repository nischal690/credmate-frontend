'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../lib/api/config';
import apiService from '../lib/api/apiService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface UserProfile {
  [key: string]: any;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'user_profile';
const PROFILE_TIMESTAMP_KEY = 'profile_last_fetched';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchProfile = async (): Promise<UserProfile | null> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Getting fresh ID token for user:', user.uid);
      console.log('User phone number:', user.phoneNumber);
      console.log('User metadata:', user.metadata);
      
      const idToken = await user.getIdToken(true);
      console.log('Got fresh ID token, first 10 chars:', idToken.substring(0, 10));
      
      const response = await fetch('http://localhost:3000/user/complete-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      console.log('Profile data received from API:', data);
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
        console.log('All localStorage contents:', Object.fromEntries(
          Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
        ));
      } else {
        console.log('No profile data received from API');
        setUserProfile(null);
        localStorage.setItem(STORAGE_KEY, 'null');
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to fetch user profile');
      setUserProfile(null);
      localStorage.setItem(STORAGE_KEY, 'null');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed. User:', user?.uid);
      setAuthInitialized(true);
      
      if (user) {
        console.log('User is authenticated, initializing profile');
        const initializeProfile = async () => {
          const cachedProfile = localStorage.getItem(STORAGE_KEY);
          console.log('Cached profile:', cachedProfile);
          
          if (cachedProfile && !shouldFetchProfile()) {
            console.log('Using cached profile');
            setUserProfile(JSON.parse(cachedProfile));
            setIsLoading(false);
          } else {
            console.log('Fetching fresh profile');
            await refreshProfile();
          }
        };
        
        initializeProfile();
      } else {
        console.log('No user, clearing profile');
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, isLoading, error, refreshProfile }}>
      {authInitialized ? children : null}
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
