'use client';

import apiService from '@/lib/api/apiService';
import { API_ENDPOINTS } from './config';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  aadharNo: string;
  panNo: string;
  profileImageUrl?: string;
  gstNo: string;
}

export async function getProfileData(uid: string): Promise<ProfileData> {
  try {
    console.log('Fetching profile for UID:', uid);

    const endpoint = `${API_ENDPOINTS.USER.PROFILE}/${uid}`;
    console.log('Using endpoint:', endpoint);

    const data = await apiService.get<ProfileData>(endpoint);
    return data;
  } catch (error: any) {
    console.error('Error getting profile data:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      endpoint: error.config?.url,
    });

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        address: 'Test Address, India',
        bio: 'Test Profile',
        aadharNo: 'XXXX-XXXX-1234',
        panNo: 'ABCDE1234F',
        gstNo: '27AAPFU0939F1ZV',
        profileImageUrl: '/default-avatar.png',
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
    return await apiService.put<ProfileData>(endpoint, data);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
