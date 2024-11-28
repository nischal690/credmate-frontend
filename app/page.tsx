'use client';

import { useEffect } from 'react';
import AppBar from './components/AppBar';
import NewsCarousel from './components/NewsCarousel';
import CreditScoreContainer from './components/CreditScoreContainer';
import RecentActivity from './components/RecentActivity';
import NavBar from './components/NavBar';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

async function logTokenToServer(token: string) {
  try {
    const response = await fetch('/api/log-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error('Failed to log token');
    }
  } catch (error) {
    console.error('Error logging token to server:', error);
  }
}

export default function Home() {
  useEffect(() => {
    // Log initial auth state
    console.log('Current user:', auth.currentUser);
    console.log('Local storage token:', localStorage.getItem('authToken'));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. User:', user?.uid);
      
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force token refresh
          console.log('Current Firebase ID Token:', token);
          await logTokenToServer(token);
        } catch (error) {
          console.error('Error getting token:', error);
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