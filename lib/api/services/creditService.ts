import apiService from '../apiService';
import { API_ENDPOINTS } from '../config';

// Types
interface CreditScore {
  score: number;
  lastUpdated: string;
  change: number;
}

interface CreditFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

// Credit Score Service
export const creditService = {
  // Get user's credit score
  getCreditScore: () => {
    return apiService.get<CreditScore>(API_ENDPOINTS.CREDIT.SCORE);
  },

  // Get credit score history
  getCreditHistory: (months: number = 12) => {
    return apiService.get<CreditScore[]>(`${API_ENDPOINTS.CREDIT.HISTORY}?months=${months}`);
  },

  // Get credit score factors
  getCreditFactors: () => {
    return apiService.get<CreditFactor[]>(API_ENDPOINTS.CREDIT.FACTORS);
  },
};
