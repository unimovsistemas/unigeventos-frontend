/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { PersonResponse } from "./personService";

const API_URL = "http://localhost:8001/rest/v1/persons";

export interface UpdatePersonPayload {
  name: string;
  birthdate: string;
  gender: string;
  maritalStatus: string;
  church: string;
  clothingSize: string;
  choralVoiceType: string;
  phoneNumber: string;
  documentNumber: string;
  personalContactEmail: string;
}

/**
 * Busca os dados da pessoa do usuário logado
 */
export const getCurrentUserPerson = async (
  token: string
): Promise<PersonResponse> => {
  try {
    const response = await axios.get(`${API_URL}/queries/get-my-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar dados do perfil"
    );
  }
};

/**
 * Atualiza os dados da pessoa do usuário logado
 */
export const updateCurrentUserPerson = async (
  token: string,
  payload: UpdatePersonPayload
): Promise<PersonResponse> => {
  try {
    const response = await axios.put(`${API_URL}/entities/{id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar perfil"
    );
  }
};

/**
 * Upload de foto de perfil
 */
export const uploadProfilePhoto = async (
  token: string,
  file: File
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/actions/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // O backend retorna { filePath: string }
    return response.data.filePath;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao fazer upload da foto"
    );
  }
};
