/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Serviço para alterar a senha do usuário logado
 * Requer autenticação (token JWT)
 */
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await authApi.post(
      `/auth/change-password`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao alterar senha"
    );
  }
};

/**
 * Validação de senha forte
 * Requisitos: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  message?: string;
} => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "A senha deve ter no mínimo 8 caracteres",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra minúscula",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um número",
    };
  }

  return { isValid: true };
};
