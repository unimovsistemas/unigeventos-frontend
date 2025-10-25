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
  redirectToRegister: (eventId: string, showMessage?: boolean) => void;
  checkAuthAndRedirect: (eventId: string) => boolean;
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

  const redirectToRegister = (eventId: string, showMessage: boolean = true): void => {
    if (authInfo.isAuthenticated) {
      // Usuário autenticado, redirecionar diretamente para registro
      router.push(`/user/events/${eventId}/register`);
    } else {
      // Usuário não autenticado, redirecionar para login com parâmetro de retorno
      const loginUrl = `/login?redirect=/user/events/${eventId}/register`;
      if (showMessage) {
        // Adicionar parâmetro para mostrar mensagem explicativa
        router.push(`${loginUrl}&message=login-required`);
      } else {
        router.push(loginUrl);
      }
    }
  };

  const checkAuthAndRedirect = (eventId: string): boolean => {
    if (authInfo.isAuthenticated) {
      router.push(`/user/events/${eventId}/register`);
      return true;
    }
    return false;
  };

  return {
    ...authInfo,
    logout,
    hasRole,
    hasAnyRole,
    redirectToRegister,
    checkAuthAndRedirect
  };
}

export default useAuth;