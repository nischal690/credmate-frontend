'use client';

import CreditScoreGauge from './CreditScoreGauge';

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
      <p className="text-center text-[#8A8A8A] mx-1 mb-1 px-1">Your <span className="text-[#A2195E]">Credmate</span> score is updated every 24 hours</p>
    </div>
  );
}
