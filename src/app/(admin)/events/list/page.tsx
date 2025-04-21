/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pencil,
  ArrowRightCircle,
  ArrowLeftCircle,
  Plus,
  SearchX,
} from "lucide-react";
import { EventDataResponse, getAllPage } from "@/services/eventsService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";

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
          currentPage
        );
        setEvents(response.content || []);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar eventos.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [currentPage]);

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
        className="p-4 bg-neutral-900 border border-neutral-700"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          renderSkeleton()
        ) : events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              className="p-4 bg-neutral-900 text-white border border-neutral-700 shadow-md"
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

              <Link href={`/events/${event.id}`}>
                <Button
                  variant="outline"
                  className="mt-4 text-orange-400 hover:text-orange-500 border-orange-600"
                >
                  <Pencil size={16} className="mr-1" /> Editar
                </Button>
              </Link>
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
        <div className="flex justify-between items-center mt-8">
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
            }`}          >
            Próxima <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
