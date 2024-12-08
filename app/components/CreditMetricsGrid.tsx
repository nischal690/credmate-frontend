'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function CreditMetricsGrid() {
  const router = useRouter();

  const handleRequestLoan = () => {
    router.push('/request');
  }
  const handleApproveLoan = () => {
    router.push('/give-credit');
  }
  const handleReportBorrower = () => {
    router.push('/report-borrower');
  }

  const metrics = [
    { title: 'Report Borrower', image: '/images/Frame.svg', onClick: handleReportBorrower },
    { title: 'Request Credit', image: '/images/Frame (1).svg' , onClick: handleRequestLoan },
    { title: 'Give Credit', image: '/images/Frame (2).svg', onClick: handleApproveLoan },
  ];

  return (
    <section className="mt-4 px-1">
      <div 
        className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-xl shadow-md p-6 mb-4 relative overflow-hidden border border-pink-100 group hover:shadow-lg transition-all duration-300 w-full mx-auto px-8"
        style={{ width: '100%' }}
      >
        <div className="grid grid-cols-3 gap-4 justify-center">
          {metrics.map((metric, index) => (
            <article 
              key={index}
              className="bg-gradient-to-br from-[#A2195E] to-[#8B1550] rounded-xl p-2 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-[83px] h-[90px] flex flex-col justify-between hover:scale-105 active:scale-95"
              onClick={metric.onClick}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <span className="text-xs font-medium leading-tight text-white line-clamp-2">{metric.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/80 flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex justify-end mt-2">
                  <Image
                    src={metric.image}
                    alt={metric.title}
                    width={32}
                    height={32}
                    priority
                    className="object-contain brightness-0 invert opacity-90"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
