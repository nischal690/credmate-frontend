'use client';

import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function PanVerificationPage() {
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Here you would make an API call to verify the PAN number
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      // On success, redirect back to profile
      router.push('/profile?verified=pan');
    } catch (error) {
      console.error('PAN verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPanValid = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCardIcon className="text-pink-500" sx={{ fontSize: 32 }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Verify PAN</h1>
            <p className="text-gray-500 mt-2">
              Enter your 10-character PAN number for verification
            </p>
          </div>

          <div className="space-y-6">
            <TextField
              fullWidth
              label="PAN Number"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
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
              disabled={!isPanValid(panNumber) || loading}
              sx={{
                bgcolor: '#EC4899',
                '&:hover': {
                  bgcolor: '#BE185D',
                },
                borderRadius: '12px',
                py: 1.5,
              }}
            >
              {loading ? 'Verifying...' : 'Verify PAN'}
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
