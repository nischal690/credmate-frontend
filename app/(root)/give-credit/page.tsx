'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ProfileSelector } from '@/components/shared/profile-selector';
import { LoanForm } from '@/components/shared/loan-form';
import { SuccessState } from '@/components/shared/success-state';
import { useLoanForm } from '@/hooks/use-loan-form';
import { useUser } from '@/contexts/UserContext';

import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import api from '@/utils/api';
import GiveCreditAppBar from '@/components/GiveCreditAppBar';
import NavBar from '@/components/NavBar';
import KYCDialog from '@/components/KYCdialog';

export default function GiveCreditPage() {
  const router = useRouter();
  const { userProfile } = useUser();
  const { formData, updateFormData } = useLoanForm('give');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showKYCDialog, setShowKYCDialog] = useState(false);
  const [selectedProtectionPlan, setSelectedProtectionPlan] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            savedProfiles={[]}
            onProfileSelect={(profile) => {
              if (profile) setShowLoanForm(true);
            }}
            onMobileNumberSubmit={(mobile) => {
              if (mobile.length === 10) setShowLoanForm(true);
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
