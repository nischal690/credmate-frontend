# Routing Documentation

## Next.js App Router Structure

### Directory Structure
```
app/
├── page.tsx                # Home page (/)
├── layout.tsx             # Root layout
├── auth/                  # Authentication routes
│   ├── phone/            # Phone authentication
│   ├── verify-otp/       # OTP verification
│   └── loading/          # Auth loading state
├── profile/              # Profile routes
│   ├── [uid]/           # Dynamic profile pages
│   └── edit/            # Profile editing
├── search-profile/       # Profile search
└── request-loan/         # Loan request flow
```

## Route Implementations

### Home Page
Location: `/app/page.tsx`
```typescript
export default function Home() {
  // Implementation
}
```

### Dynamic Routes
Example: Profile Page
Location: `/app/profile/[uid]/page.tsx`
```typescript
export default function ProfilePage({ params }: { params: { uid: string } }) {
  // Implementation using uid parameter
}
```

### Route Groups
```
app/
├── (auth)/               # Authentication group
│   ├── login/
│   └── register/
├── (dashboard)/         # Dashboard group
│   ├── overview/
│   └── settings/
└── (public)/           # Public pages group
    ├── about/
    └── contact/
```

## Navigation

### Client-Side Navigation
```typescript
'use client';
import { useRouter } from 'next/navigation';

function NavigationExample() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/destination');
    // or
    router.replace('/destination');
    // or
    router.back();
  };
}
```

### Link Component
```typescript
import Link from 'next/link';

function LinkExample() {
  return (
    <Link 
      href="/destination"
      className="..."
      prefetch={false} // Optional
    >
      Navigate
    </Link>
  );
}
```

## Route Protection

### Middleware
Location: `/middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('token');
  
  if (!token && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Loading and Error States

### Loading State
Location: `/app/profile/loading.tsx`
```typescript
export default function Loading() {
  return (
    <div className="loading-spinner">
      Loading...
    </div>
  );
}
```

### Error Handling
Location: `/app/profile/error.tsx`
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Route Metadata

### Static Metadata
```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

### Dynamic Metadata
```typescript
export async function generateMetadata({ params }) {
  return {
    title: `Profile - ${params.name}`,
    description: `View profile of ${params.name}`,
  };
}
```

## Best Practices

### 1. Route Organization
- Group related routes together
- Use meaningful directory names
- Keep route hierarchy shallow

### 2. Performance
- Implement proper loading states
- Use route groups for code splitting
- Optimize data fetching

### 3. Security
- Implement proper middleware checks
- Validate route parameters
- Handle authentication properly

### 4. Error Handling
- Implement error boundaries
- Provide meaningful error messages
- Include recovery mechanisms

### 5. SEO
- Include proper metadata
- Implement proper status codes
- Handle dynamic routes properly
