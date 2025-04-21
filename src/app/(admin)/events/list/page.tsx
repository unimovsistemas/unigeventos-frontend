/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pencil,
  ArrowRightCircle,
  ArrowLeftCircle,
  Plus,
  SearchX,
  Megaphone,
  Loader2,
} from "lucide-react";
import {
  EventDataResponse,
  getAllPage,
  publishEvent,
} from "@/services/eventsService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const eventTypeLabels: Record<string, string> = {
  RETREAT: "Retiro",
  LEADERS_RETREAT: "Retiro de líderes",
  MEETING: "Reunião",
  CONFERENCE: "Conferência",
  WORKSHOP: "Workshop",
  SEMINARY: "Seminário",
  VIGIL: "Vigília",
  CULT: "Culto",
  CORAL: "Coral",
  CONCERT: "Concerto",
  THEATER: "Teatro",
  COURSE: "Curso",
  EVANGELISM: "Evangelismo",
};

export default function EventsListPage() {
  const [events, setEvents] = useState<EventDataResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setPublishingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [onlyPublished, setOnlyPublished] = useState(false);

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
    async function fetchEvents() {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token de acesso não encontrado.");
          return;
        }

        const response: PageResponse<EventDataResponse> = await getAllPage(
          token,
          debounceSearch,
          onlyPublished,
          currentPage
        );

        setEvents(response.content || []);
        setTotalPages(response.totalPages);

        // Mantém o foco no campo de busca
        setDataLoaded(true);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar eventos.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [currentPage, debounceSearch, onlyPublished]);

  const publishEventById = async (id: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    setPublishingId(id);

    try {
      if (!token) return;

      await publishEvent(token, id as string);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, isPublished: true } : event
        )
      );

      toast.success("Evento publicado com sucesso!");

      // Mantém o foco no campo de busca
      setDataLoaded(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Erro inesperado. Entre em contato com o administrador do sistema!";
      toast.error(`Erro ao publicar o evento. Causa: ${errorMessage}`);
    } finally {
      setPublishingId(null);
    }
  };

  useEffect(() => {
    if (dataLoaded && inputRef.current) {
      inputRef.current.focus();
      setDataLoaded(false); // impede foco repetido
    }
  }, [dataLoaded]);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card
        key={index}
        className="p-4 bg-gradient-to-br from-[#333333] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700"
      >
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
        <h1 className="text-3xl font-bold text-orange-400">Eventos</h1>
        <Link href="/events/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md shadow transition flex items-center">
            Novo Evento <Plus className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <input
          type="text"
          ref={inputRef}
          placeholder="Buscar pelo nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 text-orange-600 rounded-lg px-3 py-2 w-80"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyPublished}
            onChange={() => setOnlyPublished((prev) => !prev)}
          />
          Mostrar apenas eventos publicados
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          renderSkeleton()
        ) : events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-md"
            >
              <h2 className="flex gap-2 items-center justify-between text-xl font-semibold text-orange-300">
                {event.name}
                {event.isFree && (
                  <span className="top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    Gratuito
                  </span>
                )}
              </h2>
              <p className="text-sm mt-2 text-neutral-300">
                {new Date(event.startDatetime).toLocaleDateString()} até{" "}
                {new Date(event.endDatetime).toLocaleDateString()}
              </p>
              <p className="text-sm text-neutral-400">
                <strong>{event.location}</strong>
              </p>
              <p className="text-sm mt-2 text-neutral-400">
                <strong>Tipo: </strong>
                {eventTypeLabels[event.type] || event.type}
              </p>
              <p className="text-sm text-neutral-400">
                <strong>Organizador: </strong>
                {event?.organizer?.name}
              </p>
              <p className="text-sm text-neutral-400">
                <strong>Total inscritos: </strong>
                {event?.numberOfSubscribers}
              </p>
              <p className="text-sm mt-2 text-orange-500">
                {event.isPublished ? "Publicado" : "Rascunho"}
              </p>

              <div className="flex items-center justify-between">
                <Link href={`/events/${event.id}`}>
                  <Button
                    variant="outline"
                    className="mt-4 text-orange-400 hover:text-orange-500 border-orange-600"
                  >
                    <Pencil size={16} className="mr-1" /> Editar
                  </Button>
                </Link>
                {!event.isPublished && (
                  <Button
                    onClick={() => publishEventById(event.id)}
                    disabled={loading}
                    variant="outline"
                    className="mt-4 text-orange-400 hover:text-orange-500 border-orange-600"
                  >
                    <Megaphone size={16} className="mr-1" /> Publicar
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-neutral-400 text-lg py-12">
            <p>
              <SearchX className="mx-auto mb-2" size={32} /> Nenhum evento
              encontrado.
            </p>
          </div>
        )}
      </div>

      {!loading && (
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
