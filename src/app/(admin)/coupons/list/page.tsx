/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  ArrowRightCircle,
  ArrowLeftCircle,
  Plus,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Grid3X3,
  List,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useCoupons } from "@/hooks/useCoupons";
import { CardLoading } from "@/components/ui/loading";

export default function CouponListPage() {
  const {
    coupons,
    loading,
    currentPage,
    totalPages,
    totalElements,
    refreshCoupons,
    nextPage,
    prevPage,
  } = useCoupons();

  const [filteredCoupons, setFilteredCoupons] = useState<typeof coupons>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Initial load
  useEffect(() => {
    refreshCoupons();
  }, []);

  // Search and filter effect
  useEffect(() => {
    let filtered = coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((coupon) => new Date(coupon.expirationDate) >= new Date());
    } else if (statusFilter === "EXPIRED") {
      filtered = filtered.filter((coupon) => new Date(coupon.expirationDate) < new Date());
    }

    setFilteredCoupons(filtered);
  }, [searchTerm, coupons, statusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshCoupons();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isExpired = (expirationDate: Date) => {
    return new Date(expirationDate) < new Date();
  };

  const getDaysUntilExpiration = (expirationDate: Date) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <Tag className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 truncate">
                Cupons de Desconto
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                {loading ? "Carregando..." : `${totalElements} cupons cadastrados`}
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
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Link href="/coupons/create" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                <span>Novo Cupom</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4 z-10" />
                <Input
                  placeholder="Buscar por código do cupom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 h-10"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid"
                      ? "bg-orange-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list"
                      ? "bg-orange-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-transparent border-neutral-600 text-neutral-300 hover:text-white hover:bg-neutral-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-neutral-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-neutral-300 mb-2 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-10 rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                    >
                      <option value="ALL">Todos</option>
                      <option value="ACTIVE">Ativos</option>
                      <option value="EXPIRED">Expirados</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Grid/List */}
        {loading ? (
          <div className="w-full">
            <CardLoading count={viewMode === "grid" ? 12 : 8} />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCoupons.map((coupon) => {
              const expired = isExpired(coupon.expirationDate);
              const daysLeft = getDaysUntilExpiration(coupon.expirationDate);

              return (
                <Card
                  key={coupon.id}
                  className="group flex flex-col h-full p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 rounded-lg shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-orange-300 group-hover:text-orange-400 transition-colors font-mono">
                        {coupon.code}
                      </h2>
                    </div>
                    {expired ? (
                      <span className="flex items-center gap-1 bg-red-600/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full border border-red-600/50">
                        <XCircle className="h-3 w-3" />
                        Expirado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-green-600/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full border border-green-600/50">
                        <CheckCircle className="h-3 w-3" />
                        Ativo
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-center p-4 bg-orange-600/10 rounded-lg border border-orange-600/30">
                      <Percent className="h-8 w-8 text-orange-400 mr-3" />
                      <div className="text-center">
                        <p className="text-3xl font-bold text-orange-400">
                          {coupon.discountPercentage}%
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">de desconto</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-neutral-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-neutral-400">Expira em</p>
                          <p className="text-sm font-semibold text-white">
                            {formatDate(coupon.expirationDate)}
                          </p>
                        </div>
                      </div>

                      {!expired && daysLeft <= 7 && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-600/10 rounded border border-yellow-600/30">
                          <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                          <p className="text-xs text-yellow-400">
                            {daysLeft === 0
                              ? "Expira hoje!"
                              : daysLeft === 1
                              ? "Expira amanhã"
                              : `Expira em ${daysLeft} dias`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/coupons/${coupon.id}/edit`} className="block mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 transition-all duration-200"
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>Editar Cupom</span>
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCoupons.map((coupon) => {
              const expired = isExpired(coupon.expirationDate);
              const daysLeft = getDaysUntilExpiration(coupon.expirationDate);

              return (
                <Card
                  key={coupon.id}
                  className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="h-3 w-3 text-orange-400" />
                          <p className="text-xs text-neutral-400">Código</p>
                        </div>
                        <p className="text-lg font-bold text-orange-300 font-mono">{coupon.code}</p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Desconto</p>
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4 text-orange-400" />
                          <p className="text-sm font-bold text-orange-400">
                            {coupon.discountPercentage}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Validade</p>
                        <p className="text-sm text-white">{formatDate(coupon.expirationDate)}</p>
                        {!expired && daysLeft <= 7 && (
                          <p className="text-xs text-yellow-400 mt-1">
                            {daysLeft === 0 ? "Expira hoje!" : `${daysLeft} dias`}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400 mb-1">Status</p>
                        {expired ? (
                          <span className="inline-flex items-center gap-1 bg-red-600/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full border border-red-600/50">
                            <XCircle className="h-3 w-3" />
                            Expirado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full border border-green-600/50">
                            <CheckCircle className="h-3 w-3" />
                            Ativo
                          </span>
                        )}
                      </div>
                    </div>

                    <Link href={`/coupons/${coupon.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCoupons.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Tag className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              {searchTerm || statusFilter !== "ALL"
                ? "Nenhum cupom encontrado"
                : "Nenhum cupom cadastrado"}
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              {searchTerm || statusFilter !== "ALL"
                ? "Tente ajustar os filtros de busca"
                : "Comece criando seu primeiro cupom de desconto"}
            </p>
            {!searchTerm && statusFilter === "ALL" && (
              <Link href="/coupons/create">
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Cupom
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <Button
              onClick={prevPage}
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
                (
                {Math.min(currentPage * 12 + 1, totalElements)}-
                {Math.min((currentPage + 1) * 12, totalElements)} de {totalElements} itens)
              </span>
            </div>

            <Button
              onClick={nextPage}
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
