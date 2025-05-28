/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { EventDataResponse, getAllPage } from "@/services/eventsService";
import {
  checkin,
  getSubscriptionsByEvent,
  SubscriptionsByEventResponse,
} from "@/services/registrationService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

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
  } | null>(null);
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionsByEventResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadOptions = async (inputValue: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    try {
      const response = await getAllPage(token, inputValue, true, 0, 10);
      return response.content.map((event: EventDataResponse) => ({
        value: event.id,
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
      const res = await getSubscriptionsByEvent(token, eventId, page, 9); // ajusta para paginação de 9
      setSubscriptions(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar inscrições.");
    } finally {
      setLoading(false);
    }
  };

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
        <AsyncSelect
          isClearable
          cacheOptions
          defaultOptions
          noOptionsMessage={() => "Nenhum evento encontrado"}
          loadOptions={debouncedLoadOptions}
          loadingMessage={() => "Carregando eventos"}
          onChange={handleEventChange}
          value={selectedEvent}
          placeholder="Digite o nome do evento..."
          className="text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading && <p className="text-neutral-400">Carregando inscrições...</p>}

      {!loading && selectedEvent && subscriptions.length === 0 && (
        <p className="text-neutral-400">Nenhuma inscrição encontrada.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-orange-300">
              {sub.personName}
            </h2>
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
              {sub.status === "CONFIRMED" && !sub.checkedIn && (
                <Button
                  onClick={() => handleCheckin(sub.id)}
                  disabled={loading}
                  variant="outline"
                  className="py-2 px-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
                >
                  Check-in Manual
                </Button>
              )}
              {sub.checkedIn && (
                <span className="top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  CheckIn Realizado
                </span>
              )}
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
    </div>
  );
}
