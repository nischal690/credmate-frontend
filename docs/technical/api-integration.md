# API Integration Documentation

## API Configuration

### Base Configuration
Location: `/app/lib/api/config.ts`

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    // ... other auth endpoints
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    // ... other user endpoints
  },
  // ... other endpoint categories
};
```

### Timeouts and Status Codes
```typescript
export const API_TIMEOUTS = {
  DEFAULT: 30000,    // 30 seconds
  UPLOAD: 60000,     // 60 seconds
  LONG_RUNNING: 120000 // 2 minutes
};

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  // ... other status codes
};
```

## API Service Implementation

### Core Service
Location: `/app/lib/api/apiService.ts`

#### Features
1. Automatic token management
2. Request/Response interceptors
3. Error handling
4. Type-safe responses

#### Methods
1. GET Request
```typescript
async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
```

2. POST Request
```typescript
async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T>
```

3. PUT Request
```typescript
async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T>
```

4. DELETE Request
```typescript
async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
```

### Error Handling
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Error interceptor
api.interceptors.response.use(
  response => response,
  error => handleApiError(error)
);
```

## Authentication Flow

### Token Management
1. Access Token Storage
2. Refresh Token Mechanism
3. Token Expiration Handling

### OTP Verification
```typescript
interface OtpVerification {
  phone: string;
  otp: string;
}

async function verifyOtp(data: OtpVerification): Promise<AuthResponse>
```

## API Usage Examples

### User Profile
```typescript
// Fetch user profile
const profile = await apiService.get(API_ENDPOINTS.USER.PROFILE);

// Update profile
const updated = await apiService.put(API_ENDPOINTS.USER.UPDATE_PROFILE, {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Loan Application
```typescript
// Submit loan application
const application = await apiService.post(API_ENDPOINTS.LOAN.APPLY, {
  amount: 50000,
  duration: 12,
  purpose: 'Business'
});

// Check application status
const status = await apiService.get(API_ENDPOINTS.LOAN.STATUS);
```

## Best Practices

1. Error Handling
```typescript
try {
  const data = await apiService.get('/endpoint');
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else {
    // Handle other errors
  }
}
```

2. Request Cancellation
```typescript
const controller = new AbortController();
const response = await apiService.get('/endpoint', {
  signal: controller.signal
});
```

3. File Uploads
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await apiService.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: API_TIMEOUTS.UPLOAD
});
```
