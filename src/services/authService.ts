/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

interface RegisterUserResponse {
  accessToken: string;
  refreshToken: string;
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

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const logout = async (refreshToken: string) => {
  await axios.post(`${API_URL}/logout`, { refreshToken });
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
  return response.data;
};
