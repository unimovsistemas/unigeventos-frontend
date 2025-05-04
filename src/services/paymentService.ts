/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface PaymentResponse {
  id: string;
  registration: {
    personName: string;
    eventName: string;
  };
  paymentType: string;
  status: string;
  provider: string;
  amount: number;
  paymentDate: string;
  installments: number;
}

const API_URL = "http://localhost:8001/rest/v1/payments";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const getPaymentsPage = async (
  accessToken: string,
  page: number = 0,
  size: number = 10
): Promise<PageResponse<PaymentResponse>> => {
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
        "Erro ao obter os status de pagamentos dos inscritos!"
    );
  }
};
