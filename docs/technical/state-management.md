# State Management Documentation

## Overview
The application uses a combination of React Context and local storage for state management. This document outlines the different state management solutions and their use cases.

## User Context

### Location: `/app/contexts/UserContext.tsx`

#### Purpose
Manages user profile data and authentication state throughout the application.

#### Key Features
- Caches user profile in localStorage
- Automatic profile refresh after 24 hours
- Loading and error state management
- Type-safe implementation

#### Usage Example
```typescript
import { useUser } from '../contexts/UserContext';

function Component() {
  const { userProfile, isLoading, error, refreshProfile } = useUser();
  // Use the user data...
}
```

#### Key Functions

1. `refreshProfile()`
   - Purpose: Manually refresh user profile data
   - Usage: When profile data needs to be forcefully updated
   - Returns: Promise<void>

2. `shouldFetchProfile()`
   - Purpose: Determines if profile should be fetched based on cache age
   - Returns: boolean

3. `fetchProfile()`
   - Purpose: Makes API call to get user profile
   - Returns: Promise<UserProfile>

#### Configuration
- Cache Duration: 24 hours
- Storage Keys:
  - Profile Data: 'user_profile'
  - Timestamp: 'profile_last_fetched'

## API Service

### Location: `/app/lib/api/apiService.ts`

#### Purpose
Handles all API communications with automatic token management and error handling.

#### Key Features
- Axios instance with interceptors
- Automatic token refresh
- Error handling
- Request/Response typing

#### Usage Example
```typescript
import apiService from '../lib/api/apiService';

// GET request
const data = await apiService.get('/endpoint');

// POST request
const response = await apiService.post('/endpoint', payload);
```

## Local Storage Management

### Key Storage Items
1. User Profile
   ```typescript
   interface StoredProfile {
     data: UserProfile;
     timestamp: number;
   }
   ```

2. Authentication Tokens
   ```typescript
   interface StoredTokens {
     accessToken: string;
     refreshToken: string;
     expiresAt: number;
   }
   ```

### Best Practices
1. Always use type-safe getters/setters
2. Include expiration timestamps
3. Handle storage errors
4. Clear sensitive data on logout

## Error Handling

### Global Error States
```typescript
interface ErrorState {
  message: string;
  code?: string;
  timestamp: number;
}
```

### Error Boundaries
- Location: `/app/components/ErrorBoundary.tsx`
- Purpose: Catch and handle React component errors
- Usage: Wrap route components
