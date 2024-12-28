// components/DebugProvider.tsx
'use client';

import { useUser } from '@/contexts/UserContext';

export function DebugProvider() {
  const { userProfile, isLoading } = useUser();
  console.log('Debug: UserProvider State', {
    hasProfile: !!userProfile,
    isLoading,
    timestamp: new Date().toISOString(),
  });
  return null;
}
