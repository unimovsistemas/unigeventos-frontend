/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { Batch, EventDataResponse, getAllPage } from "@/services/eventsService";
import {
  cancelRegistration,
  changeBatch,
  checkin,
  repay,
} from "@/services/registrationService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  MoreVertical,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Truck,
  AlertCircle,
  RefreshCw,
  Calendar,
  User,
  Filter,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { putOnWaitingList } from "@/services/registrationService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { CardLoading } from "@/components/ui/loading";

const ClientOnlyAsyncSelect = dynamic(() => import("react-select/async"), {
  ssr: false,
});

export const SubscriptionStatusLabels: Record<string, string> = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  CANCELED: "CANCELADO",
  WAITLIST: "LISTA-ESPERA",
  REFUNDED: "REEMBOLSADO",
};

export const TransportationLabels: Record<string, string> = {
  PERSONAL: "Pessoal",
  EVENT_TRANSPORT: "Fornecido pelo organizador",
  NOT_INFORMED: "Não Informado",
};

export default function EventSubscriptionList() {
  const [selectedEvent, setSelectedEvent] = useState<{
    label: string;
    value: string;
    batches: Batch[];
  } | null>(null);
  
  const {
    subscriptions,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchSubscriptions,
    refreshSubscriptions,
    nextPage,
    prevPage,
  } = useSubscriptions(selectedEvent?.value || null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [checkinFilter, setCheckinFilter] = useState<string>("ALL");

  const [isChangeBatchModalOpen, setIsChangeBatchModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Debounce search
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Fetch on search change
  useEffect(() => {
    if (selectedEvent) {
      fetchSubscriptions(debouncedSearch, 0);
    }
  }, [debouncedSearch, selectedEvent]);

  const loadOptions = async (inputValue: string) => {
    try {
      const response = await getAllPage(inputValue, true, 0, 10);
      return response.content.map((event: EventDataResponse) => ({
        value: event.id,
        batches: event.batches,
        label: `${event.name} - ${new Date(event.startDatetime).toLocaleDateString("pt-BR")}`,
      }));
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar eventos.");
      return [];
    }
  };

  const debouncedLoadOptions = useMemo(() => debounce(loadOptions, 500), []);

  const handleEventChange = async (selected: any) => {
    setSelectedEvent(selected);
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setCheckinFilter("ALL");
    if (selected) {
      fetchSubscriptions("", 0);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshSubscriptions(debouncedSearch);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCheckin = async (registrationId: string) => {
    try {
      await checkin(registrationId);
      toast.success("Check-in realizado com sucesso!");
      refreshSubscriptions(debouncedSearch);
    } catch (error: any) {
      toast.error(`Erro ao fazer check-in: ${error.message}`);
    }
  };

  const handleCancel = async (registrationId: string) => {
    try {
      await cancelRegistration(registrationId);
      toast.success("Inscrição cancelada com sucesso!");
      refreshSubscriptions(debouncedSearch);
    } catch (error: any) {
      toast.error(`Erro ao cancelar inscrição: ${error.message}`);
    }
  };

  const handlePutOnWaitingList = async (registrationId: string) => {
    try {
      await putOnWaitingList(registrationId);
      toast.success("Inscrição movida para lista de espera!");
      refreshSubscriptions(debouncedSearch);
    } catch (error: any) {
      toast.error(`Erro ao mover para lista de espera: ${error.message}`);
    }
  };

  const handleRepay = async (registrationId: string) => {
    try {
      await repay(registrationId);
      toast.success("Inscrição reembolsada com sucesso!");
      refreshSubscriptions(debouncedSearch);
    } catch (error: any) {
      toast.error(`Erro ao reembolsar: ${error.message}`);
    }
  };

  const changeEventBatch = async () => {
    if (selectedSubId && selectedBatchId) {
      try {
        await changeBatch(selectedSubId, selectedBatchId);
        toast.success("Lote alterado com sucesso!");
        setIsChangeBatchModalOpen(false);
        setSelectedBatchId(null);
        setSelectedSubId(null);
        refreshSubscriptions(debouncedSearch);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Erro ao alterar lote.");
      }
    } else {
      toast.error("Selecione um lote.");
    }
  };

  const handlePrevPage = () => {
    prevPage(debouncedSearch);
  };

  const handleNextPage = () => {
    nextPage(debouncedSearch);
  };

  // Apply filters
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (statusFilter !== "ALL" && sub.status !== statusFilter) return false;
    if (checkinFilter === "CHECKED_IN" && !sub.checkedIn) return false;
    if (checkinFilter === "NOT_CHECKED_IN" && sub.checkedIn) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-400 bg-green-600/20 border-green-600/50";
      case "PENDING":
        return "text-yellow-400 bg-yellow-600/20 border-yellow-600/50";
      case "CANCELED":
        return "text-red-400 bg-red-600/20 border-red-600/50";
      case "WAITLIST":
        return "text-blue-400 bg-blue-600/20 border-blue-600/50";
      case "REFUNDED":
        return "text-purple-400 bg-purple-600/20 border-purple-600/50";
      default:
        return "text-neutral-400 bg-neutral-600/20 border-neutral-600/50";
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 truncate">
                Inscrições por Evento
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                {loading
                  ? "Carregando..."
                  : selectedEvent
                  ? `${totalElements} inscrições encontradas`
                  : "Selecione um evento para ver as inscrições"}
              </p>
            </div>
          </div>

          {selectedEvent && (
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border-neutral-600 hover:border-orange-500"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          )}
        </div>

        {/* Event Selector */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <label className="text-sm text-neutral-300 mb-2 block flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-400" />
            Selecione o Evento
          </label>
          <ClientOnlyAsyncSelect
            isClearable
            cacheOptions
            defaultOptions
            noOptionsMessage={() => "Nenhum evento encontrado"}
            loadOptions={debouncedLoadOptions}
            loadingMessage={() => "Carregando eventos..."}
            onChange={handleEventChange}
            value={selectedEvent}
            placeholder="Digite o nome do evento..."
            className="text-gray-800"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1a1a1a",
                borderColor: "#404040",
                color: "white",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1a1a1a",
                border: "1px solid #404040",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#fb8500" : "#1a1a1a",
                color: "white",
              }),
            }}
          />
        </Card>

        {/* Search and Filters */}
        {selectedEvent && (
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4 z-10" />
                  <Input
                    placeholder="Buscar por nome do participante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 h-10"
                  />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-300 mb-2 block">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                      >
                        <option value="ALL">Todos</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="PENDING">Pendente</option>
                        <option value="CANCELED">Cancelado</option>
                        <option value="WAITLIST">Lista de Espera</option>
                        <option value="REFUNDED">Reembolsado</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-300 mb-2 block">Check-in</label>
                      <select
                        value={checkinFilter}
                        onChange={(e) => setCheckinFilter(e.target.value)}
                        className="w-full h-10 rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                      >
                        <option value="ALL">Todos</option>
                        <option value="CHECKED_IN">Check-in Realizado</option>
                        <option value="NOT_CHECKED_IN">Sem Check-in</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="w-full">
            <CardLoading count={12} />
          </div>
        ) : !selectedEvent ? (
          <div className="text-center py-12 px-4">
            <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              Nenhum evento selecionado
            </h3>
            <p className="text-sm text-neutral-400">
              Selecione um evento acima para visualizar as inscrições
            </p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-sm text-neutral-400">
              {searchTerm || statusFilter !== "ALL" || checkinFilter !== "ALL"
                ? "Tente ajustar os filtros de busca"
                : "Ainda não há inscrições para este evento"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredSubscriptions.map((sub) => (
              <Card
                key={sub.id}
                className="group flex flex-col h-full p-4 sm:p-5 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 rounded-lg shadow-lg hover:shadow-xl hover:border-orange-500/50 transition-all duration-300"
              >
                {/* Header with Name and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-4 w-4 text-orange-400 flex-shrink-0" />
                    <h2 className="text-base font-semibold text-orange-300 truncate">
                      {sub.personName}
                    </h2>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className="bg-[#2b2b2b] border border-neutral-700 text-white rounded-md shadow-lg w-56 mt-2 p-1 z-50"
                    >
                      <DropdownMenuItem
                        disabled={sub.checkedIn || sub.status !== "CONFIRMED"}
                        onSelect={() => handleCheckin(sub.id)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          sub.checkedIn || sub.status !== "CONFIRMED"
                            ? "text-neutral-400 cursor-not-allowed opacity-50"
                            : "text-neutral-200 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2 inline" />
                        Check-in Manual
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={sub.status === "CANCELED"}
                        onSelect={() => handleCancel(sub.id)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          sub.status === "CANCELED"
                            ? "text-neutral-400 cursor-not-allowed opacity-50"
                            : "text-neutral-200 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        <XCircle className="h-4 w-4 mr-2 inline" />
                        Cancelar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={sub.status !== "PENDING"}
                        onSelect={() => handlePutOnWaitingList(sub.id)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          sub.status !== "PENDING"
                            ? "text-neutral-400 cursor-not-allowed opacity-50"
                            : "text-neutral-200 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        <Clock className="h-4 w-4 mr-2 inline" />
                        Lista de Espera
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={sub.status !== "PENDING" && sub.status !== "WAITLIST"}
                        onSelect={() => {
                          setSelectedSubId(sub.id);
                          setSelectedBatchId(sub.batch.id);
                          setIsChangeBatchModalOpen(true);
                        }}
                        className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          sub.status !== "PENDING" && sub.status !== "WAITLIST"
                            ? "text-neutral-400 cursor-not-allowed opacity-50"
                            : "text-neutral-200 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        <Tag className="h-4 w-4 mr-2 inline" />
                        Alterar Lote
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={sub.status !== "CONFIRMED"}
                        onSelect={() => handleRepay(sub.id)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                          sub.status !== "CONFIRMED"
                            ? "text-neutral-400 cursor-not-allowed opacity-50"
                            : "text-neutral-200 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        <DollarSign className="h-4 w-4 mr-2 inline" />
                        Reembolsar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-orange-400" />
                    <span className="text-neutral-400">Inscrição:</span>
                    <span className="text-white">
                      {new Date(sub.registrationDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-orange-400" />
                    <span className="text-neutral-400">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(
                        sub.status
                      )}`}
                    >
                      {SubscriptionStatusLabels[sub.status] || sub.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-orange-400" />
                    <span className="text-neutral-400">Lote:</span>
                    <span className="text-white truncate">{sub.batch.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-orange-400" />
                    <span className="text-neutral-400">Valor:</span>
                    <span className="text-white">R$ {sub.amountPaid.toFixed(2)}</span>
                  </div>

                  {sub.totalDiscount > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-green-400" />
                      <span className="text-neutral-400">Desconto:</span>
                      <span className="text-green-400">R$ {sub.totalDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-orange-400" />
                    <span className="text-neutral-400">Transporte:</span>
                    <span className="text-white text-xs truncate">
                      {TransportationLabels[sub.transportationType] || sub.transportationType}
                    </span>
                  </div>

                  {sub.ministries && (
                    <div className="pt-2 border-t border-neutral-700">
                      <span className="text-neutral-400 text-xs">Ministérios:</span>
                      <p className="text-white text-xs mt-1">{sub.ministries}</p>
                    </div>
                  )}
                </div>

                {/* QR Code and Check-in Status */}
                <div className="mt-4 pt-4 border-t border-neutral-700 flex flex-col items-center gap-3">
                  <img
                    src={`data:image/png;base64,${sub.qrCodeBase64}`}
                    alt="QR Code"
                    className="w-20 h-20 rounded-md border-2 border-neutral-600"
                  />
                  {sub.checkedIn && (
                    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      Check-in Realizado
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && selectedEvent && filteredSubscriptions.length > 0 && totalPages > 1 && (
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
                ({Math.min(currentPage * 12 + 1, totalElements)}-
                {Math.min((currentPage + 1) * 12, totalElements)} de {totalElements} itens)
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

        {/* Change Batch Modal */}
        <Dialog open={isChangeBatchModalOpen} onOpenChange={setIsChangeBatchModalOpen}>
          <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
            <DialogHeader>
              <DialogTitle className="text-orange-400">Alterar Lote da Inscrição</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <label htmlFor="batch-select" className="text-sm text-neutral-300">
                Selecione o novo lote:
              </label>
              <select
                id="batch-select"
                className="bg-neutral-800 text-white border border-neutral-600 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                value={selectedBatchId || ""}
                onChange={(e) => setSelectedBatchId(e.target.value)}
              >
                <option value="" disabled>
                  -- Selecione um lote --
                </option>
                {selectedEvent?.batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} - R$ {batch.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  setIsChangeBatchModalOpen(false);
                  setSelectedBatchId(null);
                  setSelectedSubId(null);
                }}
                variant="outline"
                className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={changeEventBatch}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
