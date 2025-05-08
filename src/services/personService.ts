/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const genderTypeLabels: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Feminino",
};

export const roleTypeLabels: Record<string, string> = {
  ROLE_ADMIN: "ADMIN",
  ROLE_LEADER: "LÍDER",
  ROLE_USER: "USUÁRIO",
};


export const maritalStatusTypeLabels: Record<string, string> = {
  MARRIED: "Casado(a)",
  SINGLE: "Solteiro(a)",
  DIVORCED: "Divorciado(a)",
  NOT_INFORMED: "Não Informado",
};

export const choralVoiceTypeLabels: Record<string, string> = {
  TENOR: "Tenor",
  BASS: "Baixo",
  CONTRALTO: "Contralto",
  SOPRANO: "Soprano",
  NOT_INFORMED: "Não Informado",
};


export interface Role {
  role: string;
}

export interface PersonResponse {
  id: string;
  name: string;
  birthdate: Date;
  gender: string;
  maritalStatus: string;
  photo: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  isLeader: boolean;
  contact: {
    phoneNumber: string;
  };
  document: {
    number: string;
    documentType: string;
  };
  login: {
    username: string;
    lastLogin: Date;
    roles: Role[];
  };
  personalContactEmail: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const API_URL = "http://localhost:8001/rest/v1/persons";

export const getPersonsPage = async (
  accessToken: string,
  page: number = 0,
  size: number = 5
): Promise<PageResponse<PersonResponse>> => {
  try {
    const response = await axios.get(
      `${API_URL}/entities/page?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao obter os usuários do sistema!"
    );
  }
};
