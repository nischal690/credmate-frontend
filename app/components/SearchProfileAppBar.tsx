'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SearchProfileAppBar() {
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
          <span className="material-icons" style={{ fontSize: '24px' }}>arrow_back</span>
        </div>
        <div className="flex-1 text-center">
          <span style={{ fontSize: '17px' }}>Search Profile</span>
        </div>
        <div className="w-[34px]"></div> {/* Empty div for balance */}
      </div>
    </div>
  );
}
