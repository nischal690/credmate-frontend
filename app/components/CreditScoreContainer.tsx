'use client';

import CreditScoreGauge from './CreditScoreGauge';
import CreditMetricsGrid from './CreditMetricsGrid';

export default function CreditScoreContainer() {
  // Example credit score data
  const creditScore = {
    score: 752,
    maxScore: 1000,
    status: 'Very Good'
  };

  return (
    <div className="credit-score-section">
      <h2 className="section-title"></h2>
      <CreditScoreGauge
        score={creditScore.score}
        maxScore={creditScore.maxScore}
        status={creditScore.status}
      />
      <p className="text-gray-500 text-center mx-5 my-2 px-4">Your <span className="text-[#A2195E]">Credmate</span> score is updated every 24 hours</p>
      <CreditMetricsGrid />
    </div>
  );
}
