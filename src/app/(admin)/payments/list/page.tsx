/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Grid3X3,
  List,
  DollarSign,
  User,
  Calendar,
  Tag,
  Receipt,
  Ticket,
} from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import StatusBadge from "@/components/ui/StatusBadge";
import { CardLoading } from "@/components/ui/loading";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

const providerTypeLabels: Record<string, string> = {
  AD_EVENTOS: "AD Eventos",
  PAG_HIPER: "PagHiper",
  USE_REDE: "e.Rede (Itaú)",
  PAGAR_ME: "Pagar.me",
};

const paymentTypeLabels: Record<string, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  INVOICE: "Boleto",
  PIX: "PIX",
};

export default function PaymentListPage() {
  const {
    payments,
    loading,
    currentPage,
    totalPages,
    totalElements,
    refreshPayments,
    nextPage,
    prevPage,
    applyDiscountToPayment,
  } = usePayments();

  const [filteredPayments, setFilteredPayments] = useState<typeof payments>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Initial load
  useEffect(() => {
    refreshPayments();
  }, []);

  // Search and filter effect
  useEffect(() => {
    let filtered = payments.filter(
      (payment) =>
        payment.registration.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.registration.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, payments, statusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshPayments();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleApplyDiscount = async () => {
    if (!selectedPayment || !couponCode.trim()) {
      toast.error("Preencha o código do cupom.");
      return;
    }

    setIsApplying(true);
    const success = await applyDiscountToPayment(selectedPayment.id, couponCode.trim());
    setIsApplying(false);

    if (success) {
      setIsModalOpen(false);
      setCouponCode("");
      setSelectedPayment(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canApplyDiscount = (status: string) => {
    return status === "PENDING" || status === "INPROCESS";
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 truncate">
                Pagamentos
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                {loading ? "Carregando..." : `${totalElements} pagamentos encontrados`}
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border-neutral-600 hover:border-orange-500"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4 z-10" />
                <Input
                  placeholder="Buscar por participante, evento ou provedor..."
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
                      <option value="PENDING">Pendente</option>
                      <option value="INPROCESS">Em Processamento</option>
                      <option value="APPROVED">Aprovado</option>
                      <option value="REJECTED">Rejeitado</option>
                      <option value="FAILED">Falhou</option>
                      <option value="CANCELLED">Cancelado</option>
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
            {filteredPayments.map((payment) => (
              <Card
                key={payment.id}
                className="group flex flex-col h-full p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 rounded-lg shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Participante</h3>
                    <h2 className="text-base sm:text-lg font-semibold text-orange-300 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {payment.registration.personName}
                    </h2>
                  </div>
                  <StatusBadge status={payment.status} type="status" />
                </div>

                <div className="space-y-3 flex-grow">
                  <div className="flex items-start gap-2">
                    <Receipt className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-neutral-400">Evento</p>
                      <p className="text-sm text-white line-clamp-2">{payment.registration.eventName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Forma de Pagamento</p>
                      <StatusBadge status={payment.paymentType} type="paymentType" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Provedor</p>
                      <p className="text-sm text-white">{providerTypeLabels[payment.provider] || payment.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-700">
                    <div>
                      <p className="text-xs text-neutral-400">Valor</p>
                      <p className="text-lg font-bold text-orange-400">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">Parcelas</p>
                      <p className="text-sm font-semibold text-white">{payment.installments}x</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>

                <Button
                  disabled={!canApplyDiscount(payment.status)}
                  onClick={() => {
                    setSelectedPayment(payment);
                    setIsModalOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className={`w-full mt-4 ${
                    canApplyDiscount(payment.status)
                      ? "bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500"
                      : "bg-transparent text-neutral-500 border-neutral-700 cursor-not-allowed"
                  }`}
                >
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {canApplyDiscount(payment.status) ? "Aplicar Desconto" : "Desconto Indisponível"}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <Card
                key={payment.id}
                className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3 text-orange-400" />
                        <p className="text-xs text-neutral-400">Participante</p>
                      </div>
                      <p className="text-sm font-semibold text-white truncate">{payment.registration.personName}</p>
                      <p className="text-xs text-neutral-400 truncate">{payment.registration.eventName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Status</p>
                      <StatusBadge status={payment.status} type="status" />
                    </div>

                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Forma</p>
                      <StatusBadge status={payment.paymentType} type="paymentType" />
                    </div>

                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Valor</p>
                      <p className="text-sm font-bold text-orange-400">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-neutral-400">{payment.installments}x</p>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Data</p>
                      <p className="text-xs text-white">{formatDate(payment.paymentDate)}</p>
                    </div>
                  </div>

                  <Button
                    disabled={!canApplyDiscount(payment.status)}
                    onClick={() => {
                      setSelectedPayment(payment);
                      setIsModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                    className={`whitespace-nowrap ${
                      canApplyDiscount(payment.status)
                        ? "bg-transparent hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500"
                        : "bg-transparent text-neutral-500 border-neutral-700 cursor-not-allowed"
                    }`}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Desconto
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPayments.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              {searchTerm || statusFilter !== "ALL" ? "Nenhum pagamento encontrado" : "Nenhum pagamento registrado"}
            </h3>
            <p className="text-sm text-neutral-400">
              {searchTerm || statusFilter !== "ALL" ? "Tente ajustar os filtros de busca" : "Os pagamentos aparecerão aqui quando forem processados"}
            </p>
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
                ({Math.min(currentPage * 12 + 1, totalElements)}-{Math.min((currentPage + 1) * 12, totalElements)} de {totalElements} itens)
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

        {/* Modal de Desconto */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border border-neutral-700 shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-orange-400 flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Aplicar Cupom de Desconto
              </DialogTitle>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-neutral-800 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Participante:</span>
                    <span className="font-medium">{selectedPayment.registration.personName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Valor Atual:</span>
                    <span className="font-bold text-orange-400">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="coupon" className="text-sm font-medium text-neutral-300">
                    Código do Cupom
                  </label>
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-neutral-800 text-white border-neutral-600 focus:border-orange-500 uppercase"
                    placeholder="Ex: DESCONTO10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApplyDiscount();
                      }
                    }}
                  />
                  <p className="text-xs text-neutral-400">Digite o código do cupom em letras maiúsculas</p>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setCouponCode("");
                  setSelectedPayment(null);
                }}
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                disabled={isApplying}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleApplyDiscount}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                disabled={isApplying || !couponCode.trim()}
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Tag className="h-4 w-4 mr-2" />
                    Aplicar Desconto
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}