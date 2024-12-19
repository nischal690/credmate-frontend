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
      <div className="bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackClick}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/searchprofileicons/arrowbendleft.svg"
                alt="Back Icon"
                width={24} 
                height={24}
                className="invert"
              />
            </button>
            <span className="text-white text-lg font-medium">Give Credit</span>
          </div>
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
