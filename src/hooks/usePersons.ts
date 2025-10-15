/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPersonsPage, PageResponse, PersonResponse } from '@/services/personService';

export const usePersons = () => {
  const [persons, setPersons] = useState<PersonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPersons = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        toast.error("Token de acesso não encontrado.");
        return;
      }

      const response: PageResponse<PersonResponse> = await getPersonsPage(token, page, 12);
      
      setPersons(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar pessoas.");
      setPersons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPersons = useCallback(() => {
    fetchPersons(currentPage);
  }, [currentPage, fetchPersons]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      fetchPersons(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchPersons]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      fetchPersons(currentPage - 1);
    }
  }, [currentPage, fetchPersons]);

  return {
    persons,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchPersons,
    refreshPersons,
    nextPage,
    prevPage,
  };
};
