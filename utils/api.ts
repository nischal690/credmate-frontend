import axios from 'axios';
import { getValidAccessToken } from './auth';
import { auth } from '../lib/firebase';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getValidAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Error in request interceptor:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Get current route
            const currentPath = window.location.pathname;
            
            // Only redirect to auth if not already on an auth page
            if (!currentPath.startsWith('/auth')) {
                try {
                    // Try to get a fresh token
                    const user = auth.currentUser;
                    if (user) {
                        const newToken = await user.getIdToken(true);
                        if (newToken) {
                            // Retry the original request with the new token
                            const originalRequest = error.config;
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return api(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
                
                // If token refresh failed or user is not authenticated, redirect to auth
                window.location.href = '/auth/phone';
            }
        }
        return Promise.reject(error);
    }
);

// Types for saved profiles
interface SavedProfile {
    id: string;
    name: string;
    date_of_birth: string;
    businessType: string;
    profileImageUrl: string;
    phoneNumber: string;
    aadhaarNumber: string | null;
    panNumber: string | null;
    createdAt: string;
    updatedAt: string;
    transactionCount: number;
    savedAt: string;
}

interface SavedProfilesResponse {
    savedProfiles: SavedProfile[];
}

// Function to fetch and store saved profiles
export const fetchAndStoreSavedProfiles = async (): Promise<SavedProfile[]> => {
    try {
        const response = await api.get<SavedProfilesResponse>('/user/saved-profiles');
        const savedProfiles = response.data.savedProfiles;
        
        // Store in localStorage
        localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
        
        return savedProfiles;
    } catch (error) {
        console.error('Error fetching saved profiles:', error);
        throw error;
    }
};

// Function to get saved profiles from localStorage
export const getSavedProfilesFromStorage = (): SavedProfile[] => {
    const profiles = localStorage.getItem('savedProfiles');
    return profiles ? JSON.parse(profiles) : [];
};

export default api;
