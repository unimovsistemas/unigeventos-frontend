/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, ArrowRightCircle, Plus, ArrowLeftCircle } from "lucide-react";
import { getAllPage } from "@/services/organizersService";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "sonner";

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

export default function OrganizerListPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganizers() {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token de acesso não encontrado.");
          return;
        }

        const response: PageResponse<Organizer> = await getAllPage(token, currentPage);
        setOrganizers(response.content || []);
        setTotalPages(response.totalPages);
        toast.success("Organizadores carregados com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar organizadores.");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizers();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="p-4 bg-neutral-900 border border-neutral-700">
        <Skeleton height={24} width="60%" />
        <Skeleton count={2} className="mt-2" />
        <Skeleton count={2} className="mt-4" />
        <Skeleton height={36} className="mt-4" />
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">Organizadores</h1>
        <Link href="/organizers/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md shadow transition flex items-center">
            Novo Organizador <Plus className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? renderSkeleton()
          : organizers.map(org => (
              <Card key={org.id} className="p-4 bg-neutral-900 text-white border border-neutral-700 shadow-md">
                <h2 className="text-xl font-semibold text-orange-300">{org.name}</h2>
                <p className="text-sm mt-2 text-neutral-300">{org.additionalDetails}</p>
                <div className="mt-4 text-sm text-neutral-400">
                  <p><strong>Email:</strong> {org.contact.email}</p>
                  <p><strong>Telefone:</strong> {org.contact.phoneNumber}</p>
                </div>
                <Link href={`/organizers/${org.id}`}>
                  <Button variant="outline" className="mt-4 text-orange-400 hover:text-orange-500 border-orange-600">
                    <Pencil size={16} className="mr-1" />
                    Editar
                  </Button>
                </Link>
              </Card>
            ))}
      </div>

      {!loading && (
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="mt-4 text-orange-400 hover:text-orange-500 cursor-pointer"
          >
            Anterior
            <ArrowLeftCircle className="mr-2" size={16} />
          </Button>

          <span className="text-white text-sm">
            Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="mt-4 text-orange-400 hover:text-orange-500 cursor-pointer"
          >
            Próxima
            <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
