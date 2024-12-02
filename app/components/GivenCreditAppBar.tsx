'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GivenCreditAppBar() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="app-bar">
      <div className="flex items-center justify-between w-full">
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
          <span style={{ fontSize: '17px' }}>Given Credit</span>
        </div>
        <div className="w-[34px]"></div> {/* Empty div for balance */}
      </div>
    </div>
  );
}
