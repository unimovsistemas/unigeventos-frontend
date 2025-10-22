import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  getAllPage, 
  getOrganizerById, 
  createOrganizer, 
  updateOrganizer 
} from "@/services/organizersService";
import { OrganizerFormData } from "@/schemas/organizerSchema";

interface Organizer {
  id: string;
  name: string;
  contact: {
    email: string;
    phoneNumber: string;
  };
  additionalDetails: string;
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

export function useOrganizers() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrganizers = useCallback(async (page: number = 0, size: number = 6) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PageResponse<Organizer> = await getAllPage(page, size);
      
      setOrganizers(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao buscar organizadores";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshOrganizers = useCallback(() => {
    fetchOrganizers(currentPage);
  }, [fetchOrganizers, currentPage]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      fetchOrganizers(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchOrganizers]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      fetchOrganizers(currentPage - 1);
    }
  }, [currentPage, fetchOrganizers]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchOrganizers(page);
    }
  }, [totalPages, fetchOrganizers]);

  return {
    organizers,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    fetchOrganizers,
    refreshOrganizers,
    nextPage,
    prevPage,
    goToPage,
  };
}

export function useOrganizer(id?: string) {
  const [organizer, setOrganizer] = useState<OrganizerFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizer = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await getOrganizerById(id);
      setOrganizer(data);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar organizador";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const createOrganizerMutation = useCallback(async (data: OrganizerFormData) => {
    try {
      await createOrganizer(data);
      toast.success("Organizador criado com sucesso!");
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao criar organizador";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateOrganizerMutation = useCallback(async (data: OrganizerFormData) => {
    if (!id) {
      throw new Error("ID do organizador não encontrado");
    }

    try {
      await updateOrganizer(id, data);
      toast.success("Organizador atualizado com sucesso!");
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao atualizar organizador";
      toast.error(errorMessage);
      throw err;
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrganizer();
    }
  }, [id, fetchOrganizer]);

  return {
    organizer,
    loading,
    error,
    fetchOrganizer,
    createOrganizerMutation,
    updateOrganizerMutation,
  };
}