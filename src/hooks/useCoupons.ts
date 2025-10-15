/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllPage, CouponsResponse } from '@/services/couponsService';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<CouponsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCoupons = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Token de acesso não encontrado.");
        return;
      }

      const response: PageResponse<CouponsResponse> = await getAllPage(token, page, 12);
      
      setCoupons(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar cupons.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCoupons = useCallback(() => {
    fetchCoupons(currentPage);
  }, [currentPage, fetchCoupons]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      fetchCoupons(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchCoupons]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      fetchCoupons(currentPage - 1);
    }
  }, [currentPage, fetchCoupons]);

  return {
    coupons,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchCoupons,
    refreshCoupons,
    nextPage,
    prevPage,
  };
};
