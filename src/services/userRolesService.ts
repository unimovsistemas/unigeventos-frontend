/* eslint-disable @typescript-eslint/no-explicit-any */
// services/userRolesService.ts
import { authApi } from '@/lib/apiClient';

export interface RolesInput {
  userId: string;
  roles: string[];
}

export async function addUserRoles(
  userName: string,
  userRoles: RolesInput
) {
  try {
    const response = await authApi.post(`/roles/add`, userRoles);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Erro ao adicionar os permissionamentos no usuário ${userName}!`
    );
  }
}

export async function removeUserRoles(
  userName: string,
  userRoles: RolesInput
) {
  try {
    const response = await authApi.post(`/roles/remove`, userRoles);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Erro ao remover os permissionamentos no usuário ${userName}!`
    );
  }
}
