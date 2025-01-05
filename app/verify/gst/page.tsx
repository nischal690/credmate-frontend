'use client';

import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import BusinessIcon from '@mui/icons-material/Business';

export default function GstVerificationPage() {
  const [gstNumber, setGstNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get user profile from localStorage
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      const { plan } = JSON.parse(profileData);
      setUserPlan(plan);
      
      // If user is not on PRO_BUSINESS or PRIORITY_BUSINESS plan, redirect to upgrade
      if (!['PRO_BUSINESS', 'PRIORITY_BUSINESS'].includes(plan)) {
        router.push('/upgrade?from=gst');
      }
    }
  }, [router]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to verify the GST number
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      // On success, redirect back to profile
      router.push('/profile?verified=gst');
    } catch (error) {
      console.error('GST verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!['PRO_BUSINESS', 'PRIORITY_BUSINESS'].includes(userPlan)) {
    return null; // Page will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BusinessIcon className="text-blue-500" style={{ fontSize: 48 }} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify GST Number
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <TextField
              fullWidth
              label="GST Number"
              variant="outlined"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={!gstNumber || loading}
            >
              {loading ? 'Verifying...' : 'Verify GST'}
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
