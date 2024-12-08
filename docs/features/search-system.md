# Search System Documentation

## Overview
The search system provides multiple methods to find and verify user profiles, including face recognition, document-based search, and identifier-based search.

## Search Methods

### 1. Face Recognition Search
Location: `/app/search-profile/face/`

Features:
- Live camera capture
- Photo upload
- Face detection
- Similarity matching

```typescript
interface FaceSearchResult {
  confidence: number;
  matches: ProfileMatch[];
  processingTime: number;
}

interface ProfileMatch {
  profile: UserProfile;
  similarity: number;
  matchedImage: string;
}
```

Implementation:
```typescript
async function searchByFace(image: File): Promise<FaceSearchResult> {
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await apiService.post('/search/face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data;
}
```

### 2. Document Search
Location: `/app/search-profile/document/`

Supported Documents:
- PAN Card
- Aadhaar Card
- GST Certificate
- Other KYC documents

```typescript
interface DocumentSearchParams {
  documentType: 'PAN' | 'AADHAAR' | 'GST';
  documentNumber: string;
  additionalVerification?: boolean;
}

async function searchByDocument(
  params: DocumentSearchParams
): Promise<SearchResult> {
  return await apiService.post('/search/document', params);
}
```

### 3. Mobile Number Search
Location: `/app/search-profile/mobile/`

Features:
- OTP verification
- Multiple profile handling
- Recent search history

```typescript
interface MobileSearchFlow {
  step1: () => Promise<void>; // Send OTP
  step2: (otp: string) => Promise<SearchResult>; // Verify & Search
}
```

## Components

### SearchProfilePage
Location: `/app/search-profile/page.tsx`

Purpose: Main search interface with multiple search options.

```typescript
export default function SearchProfilePage() {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>();
  const [results, setResults] = useState<SearchResult[]>([]);
  
  return (
    <div>
      <SearchMethodSelector onSelect={setSearchMethod} />
      <SearchInterface method={searchMethod} onResult={handleResult} />
      <SearchResults results={results} />
    </div>
  );
}
```

### FaceSearchComponent
Location: `/app/components/FaceSearch.tsx`

Features:
- Camera access
- Image preview
- Upload option
- Real-time face detection

```typescript
function FaceSearch({ onSearch }: FaceSearchProps) {
  const [stream, setStream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Initialize camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(setStream)
      .catch(console.error);
      
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);
  
  // Component implementation...
}
```

## API Integration

### Endpoints
```typescript
export const SEARCH_ENDPOINTS = {
  FACE: '/search/face',
  DOCUMENT: '/search/document',
  MOBILE: '/search/mobile',
  VERIFY_OTP: '/search/verify-otp',
};
```

### Error Handling
```typescript
async function handleSearch(params: SearchParams) {
  try {
    const result = await performSearch(params);
    handleSearchSuccess(result);
  } catch (error) {
    if (error.response?.status === 404) {
      handleNoResults();
    } else if (error.response?.status === 429) {
      handleRateLimitExceeded();
    } else {
      handleGenericError(error);
    }
  }
}
```

## Security Measures

### 1. Rate Limiting
```typescript
const RATE_LIMITS = {
  FACE_SEARCH: 10, // per minute
  DOCUMENT_SEARCH: 20, // per minute
  MOBILE_SEARCH: 5, // per minute
};
```

### 2. Data Protection
- Encrypt all search parameters
- Mask sensitive information
- Implement proper access controls

### 3. Verification Flow
```typescript
interface VerificationFlow {
  initiateVerification(): Promise<string>; // Returns verification ID
  submitVerification(id: string, code: string): Promise<boolean>;
  completeSearch(verificationId: string): Promise<SearchResult>;
}
```

## Best Practices

### 1. Performance Optimization
```typescript
// Implement debouncing for search
const debouncedSearch = debounce((term: string) => {
  performSearch(term);
}, 300);

// Cache recent searches
const searchCache = new Map<string, SearchResult>();
```

### 2. User Experience
- Show clear loading states
- Provide helpful error messages
- Implement proper validation
- Show search suggestions

### 3. Mobile Responsiveness
```typescript
const useResponsiveSearch = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return {
    showCamera: isMobile,
    showUpload: !isMobile,
    // Other responsive features
  };
};
```

### 4. Error Recovery
```typescript
function SearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<SearchErrorFallback />}
      onError={reportSearchError}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 5. Analytics
- Track search methods used
- Monitor success rates
- Log error patterns
- Measure response times
