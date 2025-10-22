/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from '@/lib/apiClient';

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
  
  export const getAllPage = async (
    page: number = 0,
    size: number = 3
  ): Promise<PageResponse<CouponsResponse>> => {
    try {
      const response = await authApi.get<PageResponse<CouponsResponse>>(`/coupons/entities/page?page=${page}&size=${size}`);
  
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter os cupons de descontos cadastrados!');
    }
  };

  export async function getCouponById(id: string) {
    const response = await authApi.get(`/coupons/entities/${id}`);
    return response.data;
  }
  
  export async function createDiscountCoupon(data: CouponsRequest) {
    const response = await authApi.post(`/coupons/entities`, data);
    return response.data;
  }
  
  export async function updateDiscountCoupon(id: string, data: CouponsRequest) {
    const response = await authApi.put(`/coupons/entities/${id}`, data);
    return response.data;
  }