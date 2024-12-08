# Components Documentation

## Core Components

### AppBar
Location: `/app/components/AppBar.tsx`

Purpose: Main navigation header component.

Features:
- Responsive design
- User profile menu
- Notification system
- Search functionality

Usage:
```tsx
import AppBar from '../components/AppBar';

function Layout() {
  return (
    <div>
      <AppBar />
      {/* Other content */}
    </div>
  );
}
```

### NavBar
Location: `/app/components/NavBar.tsx`

Purpose: Bottom navigation for mobile views.

Features:
- Mobile-first design
- Active route highlighting
- Icon animations
- Badge notifications

### CreditScoreContainer
Location: `/app/components/CreditScoreContainer.tsx`

Purpose: Displays user's credit score and related metrics.

Features:
- Circular progress indicator
- Score breakdown
- Historical trends
- Color-coded indicators

Props:
```typescript
interface CreditScoreProps {
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated?: string;
}
```

### LoanApplication
Location: `/app/components/LoanApplication.tsx`

Purpose: Handles loan application process.

Features:
- Multi-step form
- Document upload
- Progress tracking
- Validation

States:
```typescript
interface LoanApplicationState {
  step: number;
  formData: LoanFormData;
  isSubmitting: boolean;
  errors: ValidationErrors;
}
```

## UI Components

### Button Variants
Location: `/app/components/ui/button.tsx`

Types:
1. Primary Button
2. Secondary Button
3. Outline Button
4. Text Button

Usage:
```tsx
import { Button } from '../components/ui/button';

<Button 
  variant="primary"
  size="large"
  onClick={handleClick}
>
  Submit
</Button>
```

### Form Components

#### TextField
Features:
- Error states
- Helper text
- Character count
- Validation integration

```tsx
import { TextField } from '../components/ui/text-field';

<TextField
  label="Email"
  error={errors.email}
  helperText="Enter your business email"
  maxLength={50}
/>
```

#### Select
Features:
- Custom styling
- Search functionality
- Multi-select option
- Group options

```tsx
import { Select } from '../components/ui/select';

<Select
  options={cityOptions}
  value={selectedCity}
  onChange={handleCityChange}
  isSearchable
/>
```

## Layout Components

### Container
Purpose: Consistent page width and padding.

```tsx
import { Container } from '../components/ui/container';

<Container size="large" className="py-8">
  {children}
</Container>
```

### Grid
Purpose: Responsive grid layout system.

```tsx
import { Grid, GridItem } from '../components/ui/grid';

<Grid columns={12} gap={4}>
  <GridItem span={6}>Content</GridItem>
  <GridItem span={6}>Content</GridItem>
</Grid>
```

## Feature Components

### NewsCarousel
Location: `/app/components/NewsCarousel.tsx`

Purpose: Displays latest news and updates.

Features:
- Auto-sliding
- Touch support
- Responsive design
- Custom navigation

### RecentActivity
Location: `/app/components/RecentActivity.tsx`

Purpose: Shows user's recent transactions and activities.

Features:
- Activity filtering
- Timeline view
- Status indicators
- Infinite scroll

## Best Practices

1. Component Organization
```
components/
├── feature/          # Feature-specific components
├── ui/              # Reusable UI components
├── layout/          # Layout components
└── common/          # Common components
```

2. Props Typing
```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  children: React.ReactNode;
}
```

3. Error Boundaries
```typescript
import { ErrorBoundary } from '../components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorMessage />}>
  <Component />
</ErrorBoundary>
```

4. Performance Optimization
```typescript
import { memo } from 'react';

export const MemoizedComponent = memo(Component, (prev, next) => {
  return prev.id === next.id;
});
```
