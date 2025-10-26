/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { getSubscriptionsByEvent, SubscriptionsByEventResponse } from "@/services/registrationService";
import { toast } from "react-toastify";

export const useSubscriptions = (eventId: string | null) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionsByEventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSubscriptions = useCallback(
    async (searchTerm = "", page = 0) => {
      if (!eventId) return;

      setLoading(true);
      try {
        const res = await getSubscriptionsByEvent(eventId, searchTerm, page, 12);
        setSubscriptions(res.content || []);
        setCurrentPage(res.number || 0);
        setTotalPages(res.totalPages || 0);
        setTotalElements(res.totalElements || 0);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar inscrições.");
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  const refreshSubscriptions = useCallback(
    (searchTerm = "") => {
      fetchSubscriptions(searchTerm, currentPage);
    },
    [fetchSubscriptions, currentPage]
  );

  const nextPage = useCallback(
    (searchTerm = "") => {
      if (currentPage < totalPages - 1) {
        fetchSubscriptions(searchTerm, currentPage + 1);
      }
    },
    [currentPage, totalPages, fetchSubscriptions]
  );

  const prevPage = useCallback(
    (searchTerm = "") => {
      if (currentPage > 0) {
        fetchSubscriptions(searchTerm, currentPage - 1);
      }
    },
    [currentPage, fetchSubscriptions]
  );

  return {
    subscriptions,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchSubscriptions,
    refreshSubscriptions,
    nextPage,
    prevPage,
  };
};
