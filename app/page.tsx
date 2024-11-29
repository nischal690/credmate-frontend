'use client';

import { useEffect } from 'react';
import AppBar from './components/AppBar';
import NewsCarousel from './components/NewsCarousel';
import CreditScoreContainer from './components/CreditScoreContainer';
import RecentActivity from './components/RecentActivity';
import NavBar from './components/NavBar';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import apiService from './lib/api/apiService';
import { API_ENDPOINTS } from './lib/api/config';

export default function Home() {
  useEffect(() => {
    // Log initial auth state
    console.log('Current user:', auth.currentUser);
    console.log('Local storage token:', localStorage.getItem('authToken'));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. User:', user?.uid);
      
      if (user) {
        try {
          const idToken = await user.getIdToken(true); // Force token refresh
          console.log('Current Firebase ID Token:', idToken);
          
          // Define the expected response type
          interface TokenResponse {
            data?: {
              token?: string;
            };
          }

          // Send the token to our backend
          const response: TokenResponse = await apiService.post(API_ENDPOINTS.AUTH.TOKEN, {
            idToken: idToken
          });
          
          // Store the response token if needed
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
          
        } catch (error) {
          console.error('Error getting or sending token:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mobile-container">
      <div className="content-container">
        <AppBar />
        <NewsCarousel />
        <CreditScoreContainer />
        <RecentActivity />
        <NavBar />
      </div>
    </div>
  );
}