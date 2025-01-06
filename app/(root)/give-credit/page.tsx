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
// UI Icons
// ---------------------
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// ---------------------
// Features/limit-free-plan-access Imports
// ---------------------
import api from '@/utils/api';
import GiveCreditAppBar from '@/components/GiveCreditAppBar';
import NavBar from '@/components/NavBar';
import KYCDialog from '@/components/KYCdialog';

// ---------------------
// Master Branch Imports
// ---------------------
import ReactConfetti from 'react-confetti';
import { auth } from '../../../lib/firebase';

// If you're using a styled TextField:
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// Example: environment variable
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

// Interface examples (from “master”)
interface Profile {
  id: string;
  name: string;
  mobile: string;
  image: string;
}

interface NavBarProps {
  className?: string;
}

/**
 * This page allows users to create (give) a credit/loan offer.
 * It merges changes from both branches:
 * - features/limit-free-plan-access
 * - master
 */
export default function GiveCreditPage() {
  const router = useRouter();
  
  // ---------------------------------
  // Hooks & State
  // ---------------------------------
  const { userProfile } = useUser();
  const { formData, updateFormData } = useLoanForm('give');

  // State from both branches
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [requestType, setRequestType] = useState('saved');
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');

  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showKYCDialog, setShowKYCDialog] = useState(false);
  const [selectedProtectionPlan, setSelectedProtectionPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Attempt to submit the loan/credit offer.
   * If the user is on a FREE plan or credit score is not enabled,
   * show a KYC dialog first.
   */
  const handleSubmit = async () => {
    if (userProfile?.plan === 'FREE' || !userProfile?.credit_score_enabled) {
      setShowKYCDialog(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/credit/offer', {
        loanAmount: Number(formData.loanAmount),
        interestRate: Number(formData.interestRate),
        paymentType: formData.paymentType,
        emiFrequency: formData.emiFrequency,
        loanTerm: Number(formData.loanTerm),
        timeUnit: formData.timeUnit,
        protectionPlan: selectedProtectionPlan,
      });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error submitting offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------
  // Render success state if the user has successfully sent
  // a credit offer
  // -------------------------------------------------------
  if (showSuccessMessage) {
    return (
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50'>
        <GiveCreditAppBar
          loanAmount={Number(formData.loanAmount)}
          isSubmitting={isSubmitting}
          onProtectionPlanSelect={setSelectedProtectionPlan}
        />
        <main className='flex-1 overflow-y-auto'>
          <SuccessState
            title='Credit Offer Submitted Successfully! 🎉'
            description='Your P2P lending offer has been sent to the borrower.'
            steps={[
              {
                icon: <UserGroupIcon className='w-8 h-8' />,
                title: 'Matching Process',
                description: "We're notifying the borrower of your offer",
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

  // -------------------------------------------------------
  // Otherwise, render the page with a “ProfileSelector”
  // or the “LoanForm” depending on the user’s flow
  // -------------------------------------------------------
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50'>
      <GiveCreditAppBar
        loanAmount={Number(formData.loanAmount)}
        isSubmitting={isSubmitting}
        onProtectionPlanSelect={setSelectedProtectionPlan}
      />
      <main className='flex-1 px-4 pt-20 pb-24 overflow-y-auto'>
        {!showLoanForm ? (
          <ProfileSelector
            type='borrower'
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
            submitButtonText='Submit Offer'
          />
        )}
      </main>

      <NavBar />

      <KYCDialog
        isOpen={showKYCDialog}
        onClose={() => setShowKYCDialog(false)}
        title='KYC Required for Credit Offer'
        description='To submit credit offers, you need to complete the KYC process first.'
      />
    </div>
  );
}
