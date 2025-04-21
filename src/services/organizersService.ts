/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

interface OrganizerData {
  id: string;
  name: string;
  contact: {
    phoneNumber: string;
    email: string;
  };
  additionalDetails: string;
}

export interface OrganizerResponse {
  id: string;
  name: string;
}

const API_URL = "http://localhost:8001/rest/v1/organizers";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getAllPage = async (
  accessToken: string,
  page: number = 0,
  size: number = 3
): Promise<PageResponse<OrganizerData>> => {
  try {
    const response = await axios.get(`${API_URL}/entities/page?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao obter os organizadores cadastrados!');
  }
};

export const getAll = async (
  accessToken: string
): Promise<OrganizerResponse[]> => {
  try {
    const response = await axios.get(`${API_URL}/entities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao obter os organizadores cadastrados!');
  }
};

export async function getOrganizerById(token: string, id: string) {
  const response = await axios.get(`${API_URL}/entities/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createOrganizer(token: string, data: any) {
  const response = await axios.post(`${API_URL}/entities`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function updateOrganizer(token: string, id: string, data: any) {
  const response = await axios.put(`${API_URL}/entities/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
