'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HistoryAppBar() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleBackClick}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
          >
            <Image
              src="/images/searchprofileicons/arrowbendleft.svg"
              alt="Back"
              width={20} 
              height={20}
              className="opacity-70"
            />
          </button>
          
          <h1 className="text-lg font-semibold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
            History
          </h1>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
}
