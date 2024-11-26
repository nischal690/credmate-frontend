'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CreditMetricsGrid() {
  const router = useRouter();

  const handleSearchProfileClick = () => {
    router.push('/search-profile');
  };

  return (
    <section className="credit-metrics-container">
      <div className="credit-metrics-grid">
        <article className="metric-card" onClick={handleSearchProfileClick} style={{ cursor: 'pointer' }}>
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Search profile</span>
              <span className="material-icons">chevron_right</span>
            </div>
            <div className="metric-image">
              <Image
                src="/images/Frame.svg"
                alt="Search profile"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Request loan</span>
              <span className="material-icons">chevron_right</span>
            </div>
            <div className="metric-image">
              <Image
                src="/images/Frame (1).svg"
                alt="Request loan"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>
        </article>
        <article className="metric-card">
          <div className="metric-content">
            <div className="metric-header">
              <span className="metric-title">Approve loan</span>
              <span className="material-icons">chevron_right</span>
            </div>
            <div className="metric-image">
              <Image
                src="/images/Frame (2).svg"
                alt="Approve loan"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
