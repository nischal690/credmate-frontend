'use client';

import CreditScoreGauge from './CreditScoreGauge';
import CreditMetricsGrid from './CreditMetricsGrid';

export default function CreditScoreContainer() {
  // Example credit score data
  const creditScore = {
    score: 738,
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
      <p className="text-center text-gray-400 mx-1 mb-1 px-1">Your <span className="text-red-500">Credmate</span> score is updated every 24 hours</p>
      <CreditMetricsGrid />
    </div>
  );
}
