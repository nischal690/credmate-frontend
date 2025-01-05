'use client';

import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import BadgeIcon from '@mui/icons-material/Badge';

export default function AadharVerificationPage() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get user profile from localStorage
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      const { plan } = JSON.parse(profileData);
      setUserPlan(plan);
      
      // If user is on FREE plan, redirect to upgrade
      if (plan === 'FREE') {
        router.push('/upgrade?from=aadhar');
      }
    }
  }, [router]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to verify the Aadhar number
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      // On success, redirect back to profile
      router.push('/profile?verified=aadhar');
    } catch (error) {
      console.error('Aadhar verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userPlan === 'FREE') {
    return null; // Page will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BadgeIcon className="text-pink-500" sx={{ fontSize: 32 }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Verify Aadhar</h1>
            <p className="text-gray-500 mt-2">
              Enter your 12-digit Aadhar number for verification
            </p>
          </div>

          <div className="space-y-6">
            <TextField
              fullWidth
              label="Aadhar Number"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              placeholder="XXXX XXXX XXXX"
              variant="outlined"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#EC4899',
                  }
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={aadharNumber.length !== 12 || loading}
              sx={{
                bgcolor: '#EC4899',
                '&:hover': {
                  bgcolor: '#BE185D',
                },
                borderRadius: '12px',
                py: 1.5,
              }}
            >
              {loading ? 'Verifying...' : 'Verify Aadhar'}
            </Button>

            <button
              onClick={() => router.back()}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
