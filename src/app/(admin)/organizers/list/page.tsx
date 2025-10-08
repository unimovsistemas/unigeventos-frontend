/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Pencil, 
  ArrowRightCircle, 
  Plus, 
  ArrowLeftCircle, 
  Search,
  Users,
  Mail,
  Phone,
  Filter,
  RefreshCw,
  Church
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardLoading } from "@/components/ui/loading";
import { useOrganizers } from "@/hooks/useOrganizers";

export default function OrganizerListPage() {
  const {
    organizers,
    loading,
    currentPage,
    totalPages,
    totalElements,
    refreshOrganizers,
    nextPage,
    prevPage,
  } = useOrganizers();

  const [filteredOrganizers, setFilteredOrganizers] = useState<typeof organizers>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load
  useEffect(() => {
    refreshOrganizers();
  }, []);

  // Search filter effect
  useEffect(() => {
    const filtered = organizers.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.additionalDetails?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrganizers(filtered);
  }, [searchTerm, organizers]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshOrganizers();
    setIsRefreshing(false);
  };

  const handlePrevPage = () => {
    prevPage();
  };

  const handleNextPage = () => {
    nextPage();
  };



  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <Church className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 truncate">
                Organizadores
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                {loading ? "Carregando..." : `${totalElements} organizadores encontrados`}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border-neutral-600 hover:border-orange-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Link href="/organizers/create" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                <span>Novo Organizador</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4 z-10" />
            <Input
              placeholder="Buscar por nome, email ou detalhes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 h-10"
            />
          </div>
          <Button 
            variant="outline"
            className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border-neutral-600 hover:border-orange-500 whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filtros</span>
          </Button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="w-full">
            <CardLoading count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredOrganizers.map((org) => (
              <Card
                key={org.id}
                className="group flex flex-col h-full p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 rounded-lg shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-orange-300 group-hover:text-orange-400 transition-colors line-clamp-2 pr-2">
                    {org.name}
                  </h2>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 bg-orange-600/10 rounded-full">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                  </div>
                </div>
                
                {org.additionalDetails && (
                  <p className="text-xs sm:text-sm text-neutral-300 mb-3 sm:mb-4 line-clamp-3 flex-grow">
                    {org.additionalDetails}
                  </p>
                )}
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 mt-auto">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-400">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                    <span className="truncate min-w-0">{org.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-400">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">{org.contact.phoneNumber}</span>
                  </div>
                </div>
                
                <Link href={`/organizers/${org.id}`} className="block mt-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 transition-all duration-200"
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Editar Organizador</span>
                    <span className="sm:hidden">Editar</span>
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrganizers.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="p-3 sm:p-4 bg-neutral-800 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
              <Church className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-neutral-300 mb-2">
              {searchTerm ? "Nenhum organizador encontrado" : "Nenhum organizador cadastrado"}
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "Tente ajustar os termos de busca" 
                : "Comece criando seu primeiro organizador"
              }
            </p>
            {!searchTerm && (
              <Link href="/organizers/create">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Organizador
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="w-full lg:w-auto bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              <span>Anterior</span>
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-neutral-300 text-center order-first lg:order-none">
              <span className="text-sm whitespace-nowrap">
                Página <strong className="text-orange-400">{currentPage + 1}</strong> de{" "}
                <strong className="text-orange-400">{totalPages}</strong>
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                ({Math.min((currentPage * 6) + 1, totalElements)}-{Math.min((currentPage + 1) * 6, totalElements)} de {totalElements} itens)
              </span>
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
              className="w-full lg:w-auto bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Próxima</span>
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
