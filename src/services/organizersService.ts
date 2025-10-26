/* eslint-disable @typescript-eslint/no-explicit-any */

import { authApi } from '@/lib/apiClient';

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
  page: number = 0,
  size: number = 3
): Promise<PageResponse<OrganizerData>> => {
  try {
    const response = await authApi.get<PageResponse<OrganizerData>>(`/organizers/entities/page?page=${page}&size=${size}`);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao obter os organizadores cadastrados!');
  }
};

export const getAll = async (): Promise<OrganizerResponse[]> => {
  try {
    const response = await authApi.get<OrganizerResponse[]>(`/organizers/entities`);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao obter os organizadores cadastrados!');
  }
};

export async function getOrganizerById(id: string) {
  const response = await authApi.get(`/organizers/entities/${id}`);
  return response.data;
}

export async function createOrganizer(data: any) {
  const response = await authApi.post(`/organizers/entities`, data);
  return response.data;
}

export async function updateOrganizer(id: string, data: any) {
  const response = await authApi.put(`/organizers/entities/${id}`, data);
  return response.data;
}
