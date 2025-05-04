/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface CouponsRequest {
    code: string;
    discountPercentage: number;
    expirationDate: Date;
  }
  
  export interface CouponsResponse {
    id: string;
    code: string;
    discountPercentage: number;
    expirationDate: Date;
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

  const API_URL = "http://localhost:8001/rest/v1/coupons";
  
  export const getAllPage = async (
    accessToken: string,
    page: number = 0,
    size: number = 3
  ): Promise<PageResponse<CouponsResponse>> => {
    try {
      const response = await axios.get(`${API_URL}/entities/page?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter os cupons de descontos cadastrados!');
    }
  };

  export async function getCouponById(token: string, id: string) {
    const response = await axios.get(`${API_URL}/entities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  
  export async function createDiscountCoupon(token: string, data: CouponsRequest) {
    const response = await axios.post(`${API_URL}/entities`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
  
  export async function updateDiscountCoupon(token: string, id: string, data: CouponsRequest) {
    const response = await axios.put(`${API_URL}/entities/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }