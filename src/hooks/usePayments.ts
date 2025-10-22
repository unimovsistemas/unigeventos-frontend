/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPaymentsPage, PageResponse, PaymentResponse } from '@/services/paymentService';
import { applyDiscount } from '@/services/discountService';

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPayments = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);

      const response: PageResponse<PaymentResponse> = await getPaymentsPage(page, 12);
      
      setPayments(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar pagamentos.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPayments = useCallback(() => {
    fetchPayments(currentPage);
  }, [currentPage, fetchPayments]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      fetchPayments(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchPayments]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      fetchPayments(currentPage - 1);
    }
  }, [currentPage, fetchPayments]);

  const applyDiscountToPayment = useCallback(async (paymentId: string, couponCode: string) => {
    try {
      await applyDiscount(paymentId, couponCode);
      toast.success("Desconto aplicado com sucesso!");
      
      // Refresh the current page
      await fetchPayments(currentPage);
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Erro ao aplicar desconto.");
      return false;
    }
  }, [currentPage, fetchPayments]);

  return {
    payments,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchPayments,
    refreshPayments,
    nextPage,
    prevPage,
    applyDiscountToPayment,
  };
};
