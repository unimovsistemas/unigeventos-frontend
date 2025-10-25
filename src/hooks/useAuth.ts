/**
 * Hook personalizado para gerenciamento de autenticação
 * Integra com cookies de forma profissional
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CookieManager from '@/lib/cookieManager';
import { logout as logoutService } from '@/services/authService';
import { checkRegistrationExists } from '@/services/registrationService';

interface AuthInfo {
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
  isLoading: boolean;
  isCheckingRegistration: boolean;
}

export function useAuth(): AuthInfo & {
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  redirectToRegister: (eventId: string, showMessage?: boolean) => Promise<void>;
  checkAuthAndRedirect: (eventId: string) => Promise<boolean>;
} {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    isAuthenticated: false,
    token: null,
    roles: [],
    isLoading: true,
    isCheckingRegistration: false
  });
  
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação nos cookies
    const { token, roles } = CookieManager.getAuthInfo();
    
    setAuthInfo({
      isAuthenticated: !!token,
      token,
      roles,
      isLoading: false,
      isCheckingRegistration: false
    });
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await logoutService();
      setAuthInfo({
        isAuthenticated: false,
        token: null,
        roles: [],
        isLoading: false,
        isCheckingRegistration: false
      });
      router.push('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setAuthInfo({
        isAuthenticated: false,
        token: null,
        roles: [],
        isLoading: false,
        isCheckingRegistration: false
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

  const redirectToRegister = async (eventId: string, showMessage: boolean = true): Promise<void> => {
    if (authInfo.isAuthenticated) {
      // Evitar múltiplas verificações simultâneas
      if (authInfo.isCheckingRegistration) return;
      
      try {
        // Marcar como verificando inscrição
        setAuthInfo(prev => ({ ...prev, isCheckingRegistration: true }));
        
        // Verificar se já existe uma inscrição antes de redirecionar
        const registrationExists = await checkRegistrationExists(eventId);
        
        if (registrationExists.exists && registrationExists.id) {
          // Se já existe inscrição, redirecionar diretamente para confirmação
          router.push(`/user/events/${eventId}/registration-confirmation?registrationId=${registrationExists.id}`);
        } else {
          // Se não existe inscrição, redirecionar para registro
          router.push(`/user/events/${eventId}/register`);
        }
      } catch (error) {
        console.error('Erro ao verificar inscrição existente:', error);
        // Em caso de erro, redirecionar para registro (comportamento padrão)
        router.push(`/user/events/${eventId}/register`);
      } finally {
        // Resetar estado de verificação
        setAuthInfo(prev => ({ ...prev, isCheckingRegistration: false }));
      }
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

  const checkAuthAndRedirect = async (eventId: string): Promise<boolean> => {
    if (authInfo.isAuthenticated) {
      // Evitar múltiplas verificações simultâneas
      if (authInfo.isCheckingRegistration) return true;
      
      try {
        // Marcar como verificando inscrição
        setAuthInfo(prev => ({ ...prev, isCheckingRegistration: true }));
        
        // Verificar se já existe uma inscrição antes de redirecionar
        const registrationExists = await checkRegistrationExists(eventId);
        
        if (registrationExists.exists && registrationExists.id) {
          // Se já existe inscrição, redirecionar diretamente para confirmação
          router.push(`/user/events/${eventId}/registration-confirmation?registrationId=${registrationExists.id}`);
        } else {
          // Se não existe inscrição, redirecionar para registro
          router.push(`/user/events/${eventId}/register`);
        }
        return true;
      } catch (error) {
        console.error('Erro ao verificar inscrição existente:', error);
        // Em caso de erro, redirecionar para registro (comportamento padrão)
        router.push(`/user/events/${eventId}/register`);
        return true;
      } finally {
        // Resetar estado de verificação
        setAuthInfo(prev => ({ ...prev, isCheckingRegistration: false }));
      }
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