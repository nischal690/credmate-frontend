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

  const metrics = [
    { title: 'Report Borrower', image: '/images/Frame.svg', onClick: () => {} },
    { title: 'Request Credit', image: '/images/Frame (1).svg' , onClick: handleRequestLoan },
    { title: 'Give Credit', image: '/images/Frame (2).svg', onClick: handleApproveLoan },
  ];

  return (
    <section className="mt-6 px-3">
      <div 
        className="bg-[#F6F6F6] rounded-[12px] w-full p-4"
      >
        <div className="grid grid-cols-3 gap-4 justify-center">
          {metrics.map((metric, index) => (
            <article 
              key={index}
              className="bg-[#A2195E] rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-[83px] h-[90px] flex flex-col justify-between"
              onClick={metric.onClick}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <span className="text-xs font-medium leading-tight text-white line-clamp-2">{metric.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex justify-end mt-2">
                  <Image
                    src={metric.image}
                    alt={metric.title}
                    width={32}
                    height={32}
                    priority
                    className="object-contain brightness-0 invert"
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
