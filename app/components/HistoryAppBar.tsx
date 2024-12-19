'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HistoryAppBar() {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl border-b border-rose-100/20">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-neutral-800/80 flex items-center justify-center shadow-sm active:scale-95 transition-all duration-200"
          >
            <Image
              src="/images/searchprofileicons/arrowbendleft.svg"
              alt="Back"
              width={18} 
              height={18}
              className="opacity-60"
            />
          </button>
          
          <h1 className="text-base font-semibold bg-gradient-to-r from-[#a2195e] to-[#ff2b8f] bg-clip-text text-transparent">
            Transaction History
          </h1>
          
          <div className="w-9" />
        </div>
      </div>
    </div>
  );
}
