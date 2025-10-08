/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/registerPersonService.ts

import axios from 'axios';

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

const API_URL = "http://localhost:8001/rest/v1/persons";

// Função para registrar os dados pessoais do usuário
export const registerPerson = async (personData: PersonRegistrationData, accessToken: string): Promise<void> => {
  console.log("Token enviado:", accessToken);
  try {
    await axios.post(`${API_URL}/actions/register`, personData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao registrar dados pessoais');
  }
};