
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RequestLoanAppBar() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="bg-gradient-to-r from-[#A2195E] to-[#8B1550] p-4">
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
        <span className="text-white text-lg font-medium">Request Credit</span>
      </div>
    </div>
  );
}