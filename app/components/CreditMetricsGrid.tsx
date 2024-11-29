'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function CreditMetricsGrid() {
  const router = useRouter();

  const handleSearchProfileClick = () => {
    router.push('/search-profile');
  };

  const metrics = [
    { title: 'Search Profile', image: '/images/Frame.svg', onClick: handleSearchProfileClick },
    { title: 'Request Loan', image: '/images/Frame (1).svg' },
    { title: 'Approve Loan', image: '/images/Frame (2).svg' },
  ];

  return (
    <section className="credit-metrics-container mt-[453px] ml-auto">
      <div 
        className="mx-[20px] bg-[#F6F6F6] rounded-[12px]"
        style={{
          width: '335px',
          height: '126px',
          padding: '18px 24.5px',
          marginLeft: 'auto'
        }}
      >
        <div className="grid grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <article 
              key={index}
              className="metric-card bg-white rounded-xl p-3 shadow-sm flex flex-col justify-between"
              onClick={metric.onClick}
              style={{ cursor: metric.onClick ? 'pointer' : 'default' }}
            >
              <div className="metric-content">
                <div className="metric-header flex justify-between items-center mb-2">
                  <span className="metric-title text-sm font-medium">{metric.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="metric-image mt-2">
                  <Image
                    src={metric.image}
                    alt={metric.title}
                    width={40}
                    height={40}
                    priority
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

