import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface UseAuthRedirectReturn {
  redirectUrl: string | null;
  handleSuccessfulAuth: (defaultPath?: string) => void;
  getRegisterLink: () => string;
  getLoginLink: () => string;
}

export function useAuthRedirect(): UseAuthRedirectReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSuccessfulAuth = useCallback((defaultPath: string = '/admin') => {
    const targetUrl = redirectUrl || defaultPath;
    
    // Use router.push for internal navigation, window.location for external or complex redirects
    if (targetUrl.startsWith('/')) {
      router.push(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  }, [redirectUrl, router]);

  const getRegisterLink = useCallback(() => {
    return redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register';
  }, [redirectUrl]);

  const getLoginLink = useCallback(() => {
    return redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login';
  }, [redirectUrl]);

  return {
    redirectUrl,
    handleSuccessfulAuth,
    getRegisterLink,
    getLoginLink
  };
}