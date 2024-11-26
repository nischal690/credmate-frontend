// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.credmate.com';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
  },
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
  },
  // Credit Score endpoints
  CREDIT: {
    SCORE: '/credit/score',
    HISTORY: '/credit/history',
    FACTORS: '/credit/factors',
  },
  // Activity endpoints
  ACTIVITY: {
    RECENT: '/activity/recent',
    DETAILS: '/activity/details',
  },
} as const;
