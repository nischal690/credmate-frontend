'use client';

import React from "react";
import Image from "next/image";

interface CreditScoreGaugeProps {
  score?: number;
  maxScore?: number;
  status?: string;
}

export default function CreditScoreGauge({ 
  score = 752, 
  maxScore = 1000,
  status = "Very Good" 
}: CreditScoreGaugeProps) {
  const percentage = Math.round((score / maxScore) * 100);

  // Calculate color based on percentage with more precise ranges
  const getPathColor = (percent: number) => {
    if (percent <= 11) return '#B42729';
    if (percent <= 22) return '#C54C27';
    if (percent <= 42) return '#FFCB1F';
    if (percent <= 59) return '#A5C52A';
    if (percent <= 69) return '#32BE39';
    return '#737373';
  };

  // Get status based on percentage
  const getStatus = (percent: number) => {
    if (percent <= 11) return 'Poor';
    if (percent <= 22) return 'Below Average';
    if (percent <= 42) return 'Fair';
    if (percent <= 59) return 'Good';
    if (percent <= 69) return 'Very Good';
    return 'Excellent';
  };

  const pathColor = getPathColor(percentage);
  const currentStatus = getStatus(percentage);

  return (
    <div className="credit-score-gauge">
      <div className="semi-circle-container">
        <Image
          src="/images/Score Bar.svg"
          alt="Credit Score Bar"
          width={300}
          height={150}
          style={{ width: '100%', height: 'auto' }}
          priority
        />
        <div className="score-display">
          <span className="score-value">{score}</span>
          <span className="score-max">/{maxScore}</span>
        </div>
      </div>
      <div className="status-label" style={{ color: pathColor }}>
        {currentStatus}
      </div>
    </div>
  );
}
