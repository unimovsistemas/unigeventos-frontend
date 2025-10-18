/* eslint-disable @typescript-eslint/no-explicit-any */
// services/userRolesService.ts
import axios from "axios";

const API_URL = "http://localhost:8001/rest/v1/roles";

export interface RolesInput {
  userId: string;
  roles: string[];
}

export async function addUserRoles(
  token: string,
  userName: string,
  userRoles: RolesInput
) {
  try {
    const response = await axios.post(`${API_URL}/add`, userRoles, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Erro ao adicionar os permissionamentos no usuário ${userName}!`
    );
  }
}

export async function removeUserRoles(
  token: string,
  userName: string,
  userRoles: RolesInput
) {
  try {
    const response = await axios.post(`${API_URL}/remove`, userRoles, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Erro ao remover os permissionamentos no usuário ${userName}!`
    );
  }
}
