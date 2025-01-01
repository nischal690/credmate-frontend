'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface CreditScoreGaugeProps {
  scoreType?: 'credmate' | 'cibil';
}

export default function CreditScoreGauge({ scoreType }: CreditScoreGaugeProps) {
  const router = useRouter();
  const { userProfile } = useUser();
  const [currentScore, setCurrentScore] = useState(0);

  // Constants for the circular arc
  const startAngle = -180; // Start from left
  const endAngle = 0; // End at right
  const radius = 120; // Radius of the arc
  const centerX = 148.5; // Center of the component
  const centerY = 143; // Center Y position

  // Determine the score and max score based on the score type
  const score =
    scoreType === 'credmate'
      ? userProfile?.credmate_score || 0
      : userProfile?.cibil_score || 0;
  const maxScore = scoreType === 'credmate' ? 1000 : 900;

  const percentage = Math.round((score / maxScore) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScore < score) {
        setCurrentScore((prev) => Math.min(prev + 5, score));
      }
    }, 6);

    return () => clearTimeout(timer);
  }, [currentScore, score]);

  const getPathColor = (percent: number) => {
    if (percent <= 11) return '#B42729';
    if (percent <= 22) return '#C54C27';
    if (percent <= 42) return '#FFCB1F';
    if (percent <= 59) return '#A5C52A';
    if (percent <= 69) return '#32BE39';
    return '#32BE39';
  };

  const getStatus = (percent: number) => {
    if (percent <= 11) return 'Poor';
    if (percent <= 22) return 'Below Average';
    if (percent <= 42) return 'Fair';
    if (percent <= 59) return 'Good';
    if (percent <= 69) return 'Very Good';
    return 'Excellent';
  };

  const handleClick = () => {
    if (userProfile?.plan !== 'FREE') {
      router.push('/credit-report');
    } else {
      alert('Please complete your KYC to access your detailed report');
    }
  };

  const pathColor = getPathColor(percentage);
  const currentStatus = getStatus(percentage);

  const angle =
    startAngle + (currentScore / maxScore) * (endAngle - startAngle);

  const radians = (angle * Math.PI) / 180;
  const sliderX = centerX + radius * Math.cos(radians);
  const sliderY = centerY + radius * Math.sin(radians);

  return (
    <div
      className='credit-score-gauge relative w-[335px] h-[180px] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]'
      onClick={handleClick}
    >
      <div className='relative w-full h-full semi-circle-container'>
        {/* Score Bar */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <img
            src='/images/Score Bar.svg'
            alt='Score Bar'
            className='w-full h-full'
          />
        </div>

        {/* Slider Bar */}
        <div
          className='absolute w-[12.81px] h-[60.02px] bg-white border border-[#2F2F2F] rounded-[4.28px]'
          style={{
            left: `${sliderX}px`,
            top: `${sliderY}px`,
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
            transformOrigin: 'center',
            transition: 'all 0.1s ease-out',
          }}
        />

        {/* Score Display */}
        <div className='absolute left-1/2 top-[100px] transform -translate-x-1/2 text-center'>
          <div className='flex items-baseline justify-center gap-1 mb-4'>
            <span
              className='text-3xl font-bold tabular-nums'
              style={{
                color: getPathColor(
                  Math.round((currentScore / maxScore) * 100)
                ),
              }}
            >
              {currentScore}
            </span>
            <span className='text-lg text-muted-foreground'>/{maxScore}</span>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div
              className='flex items-center gap-1.5 px-2 py-0.5 rounded-lg'
              style={{ backgroundColor: '#F2F2F2' }}
            >
              <HelpCircle className='w-3 h-3 text-gray-500' />
              <span
                className='text-xs font-medium'
                style={{ color: pathColor }}
              >
                {currentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
