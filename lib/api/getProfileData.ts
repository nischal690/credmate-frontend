'use client';

import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from './config';

export interface ProfileData {
  id?: string;
  name: string;
  email: string | null;
  phoneNumber: string;
  date_of_birth?: string;
  businessType: string;
  profileImageUrl: string | null;
  aadhaarNumber: string | null;
  panNumber: string | null;
  plan: string;
  referralCode?: string;
  planPrice?: number | null;
  metadata?: any | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getProfileData(uid: string): Promise<ProfileData> {
  try {
    console.log('Fetching profile for UID:', uid);

    // I will first try get data from local storage
    const cachedProfile = localStorage.getItem('user-profile');
    if (cachedProfile) {
      const profileData = JSON.parse(cachedProfile);
      if (profileData && profileData.id === uid) {
        console.log('Returning cached profile data');
        return profileData;
      }
    }

    const endpoint = `${API_ENDPOINTS.USER.PROFILE}/${uid}`;
    console.log('Using endpoint:', endpoint);

    const data = await apiService.get<ProfileData>(endpoint);

    // cache the result to localstorage
    localStorage.setItem('user-profile', JSON.stringify(data));
    return data;
  } catch (error: any) {
    console.error('Error getting profile data:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      endpoint: error.config?.url,
    });

    // For development, return mock data that matches the new interface
    if (process.env.NODE_ENV === 'development') {
      return {
        id: uid,
        name: 'Test User',
        email: null,
        phoneNumber: '+11111111111',
        date_of_birth: new Date().toISOString(),
        businessType: 'Public Limited',
        profileImageUrl: '/default-avatar.png',
        aadhaarNumber: null,
        panNumber: null,
        plan: 'FREE',
        referralCode: 'test-referral',
        planPrice: null,
        metadata: null,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    throw error;
  }
}

// Optionally, add a new function for updating profile
export async function updateProfileData(
  uid: string,
  data: Partial<ProfileData>
) {
  try {
    const endpoint = `${API_ENDPOINTS.USER.UPDATE_PROFILE}/${uid}`;
    const response = await apiService.put<ProfileData>(endpoint, data);

    // Update the cache with new data
    const cachedProfile = localStorage.getItem('user_profile');
    if (cachedProfile) {
      const currentProfile = JSON.parse(cachedProfile);
      const updatedProfile = { ...currentProfile, ...data };
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    }

    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
