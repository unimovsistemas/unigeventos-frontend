/**
 * Hook personalizado para gerenciamento de autenticação
 * Integra com cookies de forma profissional
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CookieManager from '@/lib/cookieManager';
import { logout as logoutService } from '@/services/authService';

interface AuthInfo {
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
  isLoading: boolean;
}

export function useAuth(): AuthInfo & {
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
} {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    isAuthenticated: false,
    token: null,
    roles: [],
    isLoading: true
  });
  
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação nos cookies
    const { token, roles } = CookieManager.getAuthInfo();
    
    setAuthInfo({
      isAuthenticated: !!token,
      token,
      roles,
      isLoading: false
    });
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      setAuthInfo({
        isAuthenticated: false,
        token: null,
        roles: [],
        isLoading: false
      });
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setAuthInfo({
        isAuthenticated: false,
        token: null,
        roles: [],
        isLoading: false
      });
      router.push('/login');
    }
  };

  const hasRole = (role: string): boolean => {
    return authInfo.roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => authInfo.roles.includes(role));
  };

  return {
    ...authInfo,
    logout,
    hasRole,
    hasAnyRole
  };
}

export default useAuth;