/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:8001/rest/v1/auth";

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
  payload: ChangePasswordPayload,
  token: string
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/change-password`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
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
