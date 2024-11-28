'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const isAuthPage = pathname?.startsWith('/auth');
        
        // Only redirect if we're not already on the correct page
        if (!token && !isAuthPage && pathname !== '/auth/phone') {
          window.location.href = '/auth/phone';
        } else if (token && isAuthPage) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Don't render children while checking auth to prevent flash
  if (isChecking) {
    return null;
  }

  return null;
}
