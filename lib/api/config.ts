// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.credmate.com';
export const API_VERSION = ''; // Removed 'v1' since it's already in the endpoint

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    TOKEN: '/auth/token',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    DOCUMENTS: '/user/documents',
    PREFERENCES: '/user/preferences',
  },

  // Credit Score endpoints
  CREDIT: {
    SCORE: '/credit/score',
    HISTORY: '/credit/history',
    FACTORS: '/credit/factors',
    REPORT: '/credit/report',
    IMPROVEMENT_TIPS: '/credit/improvement-tips',
  },

  // Loan endpoints
  LOAN: {
    APPLY: '/loan/apply',
    STATUS: '/loan/status',
    DETAILS: '/loan/details',
    DOCUMENTS: '/loan/documents',
    EMI_CALCULATOR: '/loan/emi-calculator',
  },

  // KYC endpoints
  KYC: {
    VERIFY_AADHAAR: '/kyc/verify/aadhaar',
    VERIFY_PAN: '/kyc/verify/pan',
    VERIFY_GST: '/kyc/verify/gst',
    UPLOAD_DOCUMENT: '/kyc/upload-document',
    STATUS: '/kyc/status',
  },

  // Activity endpoints
  ACTIVITY: {
    RECENT: '/activity/recent',
    DETAILS: '/activity/details',
    NOTIFICATIONS: '/activity/notifications',
  },
} as const;

// API request timeouts (in milliseconds)
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000,  // 60 seconds for file uploads
  LONG_RUNNING: 120000, // 2 minutes for long-running operations
} as const;

// API response status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
