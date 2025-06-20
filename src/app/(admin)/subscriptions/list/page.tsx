/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { Batch, EventDataResponse, getAllPage } from "@/services/eventsService";
import {
  cancelRegistration,
  changeBatch,
  checkin,
  getSubscriptionsByEvent,
  repay,
  SubscriptionsByEventResponse,
} from "@/services/registrationService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, ArrowRightCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { putOnWaitingList } from "../../../../services/registrationService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

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
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionsByEventResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isChangeBatchModalOpen, setIsChangeBatchModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    if (dataLoaded && inputRef.current) {
      inputRef.current.focus();
      setDataLoaded(false); // impede foco repetido
    }
  }, [dataLoaded]);

  const loadOptions = async (inputValue: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    try {
      const response = await getAllPage(token, inputValue, true, 0, 10);
      return response.content.map((event: EventDataResponse) => ({
        value: event.id,
        batches: event.batches,
        label: `${event.name} - ${new Date(
          event.startDatetime
        ).toLocaleDateString()}`,
      }));
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar eventos.");
      return [];
    }
  };

  // ✅ Debounce da função de carregamento
  const debouncedLoadOptions = useMemo(() => debounce(loadOptions, 500), []);

  const fetchSubscriptions = async (eventId: string, page = 0) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await getSubscriptionsByEvent(
        token,
        eventId,
        debounceSearch,
        page,
        9
      ); // ajusta para paginação de 9
      setSubscriptions(res.content || []);
      setTotalPages(res.totalPages || 0);
      // Mantém o foco no campo de busca
      setDataLoaded(true);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar inscrições.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchSubscriptionsUseEffect() {
      const token = localStorage.getItem("accessToken");
      if (!token || !selectedEvent) return;

      setLoading(true);
      try {
        const res = await getSubscriptionsByEvent(
          token,
          selectedEvent.value,
          debounceSearch,
          0,
          9
        ); // ajusta para paginação de 9
        setSubscriptions(res.content || []);
        setTotalPages(res.totalPages || 0);
        // Mantém o foco no campo de busca
        setDataLoaded(true);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar inscrições.");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionsUseEffect();
  }, [currentPage, debounceSearch]);

  const handleEventChange = async (selected: any) => {
    setSelectedEvent(selected);
    setCurrentPage(0);
    if (!selected) return;
    await fetchSubscriptions(selected.value, 0);
  };

  const handleCheckin = async (registrationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : "";

      if (!token) {
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }

      await checkin(token, registrationId);
      toast.success("Check-in realizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao fazer check-in. Causa: ${error.message}`);
    }
  };

  const handleCancel = async (registrationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : "";

      if (!token) {
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }

      await cancelRegistration(token, registrationId);
      toast.success("Cancelamento da inscrição realizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao fazer check-in. Causa: ${error.message}`);
    }
  };

  const handlePutOnWaitingList = async (registrationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : "";

      if (!token) {
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }

      await putOnWaitingList(token, registrationId);
      toast.success("Inscrição alterada para lista de espera com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao fazer check-in. Causa: ${error.message}`);
    }
  };

  const handleRepay = async (registrationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : "";

      if (!token) {
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }

      await repay(token, registrationId);
      toast.success("Inscrição reembolsada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao fazer check-in. Causa: ${error.message}`);
    }
  };

  const changeEventBatch = async () => {
    if (selectedSubId && selectedBatchId) {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : "";

        if (!token) {
          toast.error("Usuário não autorizado para realizar esta ação!");
          return;
        }

        await changeBatch(token, selectedSubId, selectedBatchId);
        toast.success("Lote alterado com sucesso.");
        setIsChangeBatchModalOpen(false);
        setSelectedBatchId(null);
        // atualizar lista se necessário
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Erro ao alterar lote.");
      }
    } else {
      toast.error("Selecione um lote.");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && selectedEvent) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchSubscriptions(selectedEvent.value, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && selectedEvent) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchSubscriptions(selectedEvent.value, newPage);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold text-orange-400 mb-6">
        Inscrições por Evento
      </h1>

      <div className="mb-6">
        <ClientOnlyAsyncSelect
          isClearable
          cacheOptions
          defaultOptions
          noOptionsMessage={() => "Nenhum evento encontrado"}
          loadOptions={debouncedLoadOptions}
          loadingMessage={() => "Carregando eventos"}
          onChange={handleEventChange}
          value={selectedEvent}
          placeholder="Digite o nome do evento..."
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading && <p className="text-neutral-400">Carregando inscrições...</p>}

      <div className="flex items-center justify-between mb-10">
        <input
          type="text"
          ref={inputRef}
          placeholder="Buscar pelo nome do participante"
          disabled={!selectedEvent}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 text-gray-600 rounded-lg px-3 py-2 w-80"
        />
      </div>

      {!loading && selectedEvent && subscriptions.length === 0 && (
        <p className="text-neutral-400">Nenhuma inscrição encontrada.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="relative flex flex-col justify-between p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Botão de Ações */}
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-orange-300">
                {sub.personName}
              </h2>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="py-2 px-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="bg-[#2b2b2b] border border-neutral-700 text-white rounded-md shadow-lg w-56 mt-2"
                >
                  <DropdownMenuItem
                    disabled={sub.checkedIn || sub.status !== "CONFIRMED"}
                    onSelect={() => handleCheckin(sub.id)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200
    ${
      sub.checkedIn || sub.status !== "CONFIRMED"
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
    }`}
                  >
                    Check-in Manual
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={sub.checkedIn || sub.status === "CONFIRMED"}
                    onSelect={() => handleCancel(sub.id)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200
    ${
      sub.checkedIn || sub.status === "CONFIRMED"
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
    }`}
                  >
                    Cancelar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={sub.checkedIn || sub.status !== "PENDING"}
                    onSelect={() => handlePutOnWaitingList(sub.id)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200
    ${
      sub.checkedIn || sub.status !== "PENDING"
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
    }`}
                  >
                    Lista de Espera
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={
                      sub.checkedIn ||
                      (sub.status !== "PENDING" && sub.status !== "WAITLIST")
                    }
                    onSelect={() => {
                      setSelectedSubId(sub.id);
                      setSelectedBatchId(sub.batch.id)
                      setIsChangeBatchModalOpen(true);
                    }}
                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200
    ${
      sub.checkedIn || (sub.status !== "PENDING" && sub.status !== "WAITLIST")
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
    }`}
                  >
                    Alterar Lote
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={sub.checkedIn || sub.status !== "CONFIRMED"}
                    onSelect={() => handleRepay(sub.id)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors duration-200
    ${
      sub.checkedIn || sub.status !== "CONFIRMED"
        ? "text-neutral-400 cursor-not-allowed"
        : "text-neutral-200 hover:bg-neutral-700 hover:text-white cursor-pointer"
    }`}
                  >
                    Reembolsar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Anexar Termo", sub.id)}
                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors duration-200 cursor-pointer rounded-md"
                  >
                    Anexar Termo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => console.log("Baixar Termo", sub.id)}
                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors duration-200 cursor-pointer rounded-md"
                  >
                    Baixar Termo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1">
              <p className="text-sm text-neutral-400 mt-1">
                Inscrição:{" "}
                <span className="font-medium text-neutral-300">
                  {new Date(sub.registrationDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium text-neutral-400">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    sub.status === "CONFIRMED"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {SubscriptionStatusLabels[sub.status] || sub.status}
                </span>
              </p>
              <p className="text-sm text-neutral-300 mt-1">
                <strong>Lote:</strong> {sub.batch.name}
              </p>
              <p className="text-sm text-neutral-300 mt-1">
                <strong>Valor pago:</strong> R$ {sub.amountPaid.toFixed(2)}
              </p>
              <p className="text-sm text-neutral-300">
                <strong>Desconto:</strong> R$ {sub.totalDiscount.toFixed(2)}
              </p>
              <p className="text-sm text-neutral-300">
                <strong>Transporte:</strong>{" "}
                {TransportationLabels[sub.transportationType] ||
                  sub.transportationType}
              </p>
              {sub.ministries && (
                <p className="text-sm text-neutral-300">
                  <strong>Ministérios:</strong> {sub.ministries}
                </p>
              )}
              {sub.additionalInfo && (
                <p className="text-sm text-neutral-400">
                  <strong>Info adicional:</strong> {sub.additionalInfo}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-3 items-center justify-center">
                <img
                  src={`data:image/png;base64,${sub.qrCodeBase64}`}
                  alt="QR Code"
                  className="w-24 h-24 rounded-md border border-neutral-600"
                />
                {sub.checkedIn && sub.status === "CONFIRMED" && (
                  <span className="top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    CheckIn Realizado
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* PAGINAÇÃO AQUI */}
      {!loading && subscriptions.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-8">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`mt-4 ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            Anterior <ArrowLeftCircle className="ml-2" size={16} />
          </Button>

          <span className="text-white text-sm">
            Página <strong>{currentPage + 1}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`mt-4 ${
              currentPage >= totalPages - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            Próxima <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}
      <Dialog
        open={isChangeBatchModalOpen}
        onOpenChange={setIsChangeBatchModalOpen}
      >
        <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
          <DialogHeader>
            <DialogTitle>Alterar lote da inscrição</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <label htmlFor="batch-select" className="text-sm">
              Selecione o novo lote:
            </label>
            <select
              id="batch-select"
              className="bg-neutral-800 text-white border border-neutral-600 rounded-md px-3 py-2 w-full"
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

          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsChangeBatchModalOpen(false);
                setSelectedBatchId(null);
              }}
              className="text-white border-neutral-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => changeEventBatch()}
              className="text-orange-400 hover:text-orange-500 border-orange-600"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
