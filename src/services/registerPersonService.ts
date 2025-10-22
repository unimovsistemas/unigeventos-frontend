/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/registerPersonService.ts

import { authApi } from '@/lib/apiClient';

interface PersonRegistrationData {
  name: string;
  birthdate: string;
  gender: string;
  maritalStatus: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  isLeader: boolean;
  contact: {
    phoneNumber: string;
    email: string;
  };
  document: {
    documentType: string;
    number: string;
  };
}

// Função para registrar os dados pessoais do usuário
export const registerPerson = async (personData: PersonRegistrationData): Promise<void> => {
  try {
    await authApi.post(`/persons/actions/register`, personData);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao registrar dados pessoais');
  }
};