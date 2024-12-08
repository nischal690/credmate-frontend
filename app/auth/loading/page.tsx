'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function LoadingPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        console.log('Loading page mounted');
        const params = new URLSearchParams(window.location.search);
        const idToken = params.get('token');
        console.log('Token present:', !!idToken);

        if (!idToken) {
          console.log('No token found, redirecting to phone auth');
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            window.location.href = '/auth/phone';
          }, 2000);
          return;
        }

        // Add a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Redirecting to home');
        window.location.href = '/';
      } catch (error) {
        console.error('Navigation error:', error);
        setError('Something went wrong. Please try again.');
        setTimeout(() => {
          window.location.href = '/auth/phone';
        }, 2000);
      }
    };

    handleNavigation();
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #A2195E 0%, #300a1c 100%)',
      }}
    >
      <CircularProgress 
        sx={{ 
          color: 'white',
          mb: 3
        }} 
        size={60} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'white',
          textAlign: 'center',
          maxWidth: '80%',
          mb: 2
        }}
      >
        {error || 'Completing authentication...'}
      </Typography>
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </Box>
  );
}
