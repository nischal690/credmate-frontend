'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ---------------------
// Shared Components
// ---------------------
import { ProfileSelector } from '@/components/shared/profile-selector';
import { LoanForm } from '@/components/shared/loan-form';
import { SuccessState } from '@/components/shared/success-state';

// ---------------------
// Hooks
// ---------------------
import { useLoanForm } from '@/hooks/use-loan-form';
import { useUser } from '@/contexts/UserContext';

// ---------------------
// Icons
// ---------------------
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// ---------------------
// From features/limit-free-plan-access
// ---------------------
import api from '@/utils/api';
import RequestLoanAppBar from '@/components/RequestLoanAppBar';
import NavBar from '@/components/NavBar';
import KYCDialog from '@/components/KYCdialog';

// ---------------------
// From master
// ---------------------
import ReactConfetti from 'react-confetti';
import { auth } from '../../../lib/firebase';

// (If you need a styled TextField; requires @mui packages)
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// Environment variable usage example
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Example: styled TextField (from “master”)
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F9F9F9',
    '& fieldset': {
      borderColor: '#E5E5E5',
    },
    '&:hover fieldset': {
      borderColor: '#A2195E',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#A2195E',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#A2195E',
    },
  },
});

// Interface example (from “master”)
interface Profile {
  id: string;
  name: string;
  mobile: string;
  image: string;
}

/**
 * RequestLoanPage:
 * Allows a user to request a loan in a P2P lending system.
 * Combines code from both branches into one cohesive file.
 */
export default function RequestLoanPage() {
  const router = useRouter();
  
  // -------------------------
  // Hooks & State
  // -------------------------
  const { userProfile } = useUser();
  const { formData, updateFormData } = useLoanForm('request');

  // State from “master” (if relevant to your workflow)
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [requestType, setRequestType] = useState('saved');
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // UI flow states
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showKYCDialog, setShowKYCDialog] = useState(false);

  /**
   * Handles the submit request for a loan
   * Shows KYC dialog if user is on FREE plan or credit score is disabled.
   */
  const handleSubmit = async () => {
    if (userProfile?.plan === 'FREE' || !userProfile?.credit_score_enabled) {
      setShowKYCDialog(true);
      return;
    }

    try {
      await api.post('/loan/request', {
        loanAmount: Number(formData.loanAmount),
        interestRate: Number(formData.interestRate),
        paymentType: formData.paymentType,
        emiFrequency: formData.emiFrequency,
        loanTerm: Number(formData.loanTerm),
        timeUnit: formData.timeUnit,
      });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  // ----------------------------------------------------
  // If the request is successful, show success state
  // ----------------------------------------------------
  if (showSuccessMessage) {
    return (
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50'>
        <RequestLoanAppBar />
        <main className='flex-1 overflow-y-auto'>
          <SuccessState
            title='Request Submitted Successfully! 🎉'
            description='Your P2P lending request has been sent to potential lenders in our network.'
            steps={[
              {
                icon: <UserGroupIcon className='w-8 h-8' />,
                title: 'Matching Process',
                description: "We're matching you with the best P2P lenders",
              },
              {
                icon: <ClockIcon className='w-8 h-8' />,
                title: 'Quick Response',
                description: 'Expect responses within 24-48 hours',
              },
              {
                icon: <ChartBarIcon className='w-8 h-8' />,
                title: 'Next Steps',
                description: 'Contract review and digital signing process',
              },
            ]}
            onDashboardClick={() => router.push('/dashboard')}
          />
        </main>
        <NavBar />
      </div>
    );
  }

  // ----------------------------------------------------
  // Otherwise, show either the ProfileSelector or LoanForm
  // ----------------------------------------------------
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50'>
      <RequestLoanAppBar />
      <main className='flex-1 px-4 pt-20 pb-24 overflow-y-auto'>
        {!showLoanForm ? (
          <ProfileSelector
            type='lender'
            savedProfiles={savedProfiles}
            onProfileSelect={(profile) => {
              if (profile) {
                setSelectedProfile(Number(profile.id));
                setShowLoanForm(true);
              }
            }}
            onMobileNumberSubmit={(mobile) => {
              setMobileNumber(mobile);
              if (mobile.length === 10) {
                setShowLoanForm(true);
              }
            }}
          />
        ) : (
          <LoanForm
            formData={formData}
            onChange={updateFormData}
            onSubmit={handleSubmit}
            submitButtonText='Submit Request'
          />
        )}
      </main>
      <NavBar />

      <KYCDialog
        isOpen={showKYCDialog}
        onClose={() => setShowKYCDialog(false)}
        title='KYC Required for Loan Request'
        description='To request loans, you need to complete the KYC process first.'
      />
    </div>
  );
}
