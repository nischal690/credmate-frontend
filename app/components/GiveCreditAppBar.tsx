'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectionPlanSheet from './ProtectionPlanSheet';

interface GiveCreditAppBarProps {
  loanAmount: number;
  onProtectionPlanSelect: (plan: string) => void;
  isSubmitting: boolean;
}

export default function GiveCreditAppBar({ loanAmount, onProtectionPlanSelect, isSubmitting }: GiveCreditAppBarProps) {
  const router = useRouter();
  const [isProtectionSheetOpen, setIsProtectionSheetOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');

  const handleBackClick = () => {
    router.back();
  };

  const handleSubmitCredit = () => {
    if (isSubmitting) {
      setIsProtectionSheetOpen(true);
    }
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    onProtectionPlanSelect(plan);
    setIsProtectionSheetOpen(false);
  };

  useEffect(() => {
    if (isSubmitting) {
      setIsProtectionSheetOpen(true);
    }
  }, [isSubmitting]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between w-full px-4 h-14">
          <div 
            className="w-[34px] h-[34px] bg-[#F4F4F4] rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleBackClick}
          >
            <Image
              src="/images/searchprofileicons/arrowbendleft.svg"
              alt="Back Icon"
              width={24} 
              height={24}
            />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[17px] font-medium">Give Credit</span>
          </div>
          <button
            onClick={handleSubmitCredit}
            className="px-4 py-2 bg-[#A2195E] text-white rounded-lg text-sm font-medium"
          >
            Submit
          </button>
        </div>
      </div>

      <ProtectionPlanSheet
        open={isProtectionSheetOpen}
        onClose={() => setIsProtectionSheetOpen(false)}
        onOpen={() => setIsProtectionSheetOpen(true)}
        onSelect={handlePlanSelect}
        selectedPlan={selectedPlan}
        loanAmount={loanAmount}
      />
    </>
  );
}
