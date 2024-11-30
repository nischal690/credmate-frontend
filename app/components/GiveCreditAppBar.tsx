'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GiveCreditAppBar() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
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
        <div className="w-[34px]"></div>
      </div>
    </div>
  );
}
