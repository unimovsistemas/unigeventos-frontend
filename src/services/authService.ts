/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CookieManager from "@/lib/cookieManager";

interface RegisterUserResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

const API_URL = "http://localhost:8001/rest/v1/auth";

// Função para registrar o usuário e retornar os tokens
export const registerUser = async (username: string, password: string): Promise<RegisterUserResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      user: { username, password },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
  }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, { username, password }, {
    withCredentials: true // Para enviar/receber cookies HttpOnly do servidor
  });
  
  // Estratégia Híbrida: Verificar se o backend já definiu cookies HttpOnly
  const existingToken = CookieManager.get('accessToken');
  const hasServerCookies = !!existingToken && existingToken !== response.data.accessToken;
  
  if (!hasServerCookies && response.data.accessToken) {
    // Fallback: Cliente define cookies seguros para desenvolvimento
    CookieManager.setAuthCookies(response.data.accessToken, response.data.roles);
    console.log('AuthService: Cookies cliente definidos (desenvolvimento)');
  } else if (hasServerCookies) {
    console.log('AuthService: Usando cookies HttpOnly do servidor (produção)');
  }
  
  return response.data;
};

export const logout = async (refreshToken?: string) => {
  try {
    await axios.post(`${API_URL}/logout`, { 
      request: refreshToken 
    }, {
      withCredentials: true // Servidor pode limpar cookies HttpOnly
    });
    
    // Limpar cookies locais (funciona para ambos os casos)
    CookieManager.clearAuthCookies();
    console.log('AuthService: Cookies de autenticação removidos');
    
  } catch (error: any) {
    // Mesmo com erro, limpar cookies locais
    CookieManager.clearAuthCookies();
    console.log('AuthService: Cookies removidos (fallback)');
    throw new Error(error.response?.data?.message || 'Erro ao fazer logout');
  }
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
  return response.data;
};

// Nova função: solicitar recuperação de senha
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao solicitar recuperação de senha');
  }
};

// Nova função: redefinir a senha com token
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
  }
};
