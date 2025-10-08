/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { EventFormData } from "@/schemas/eventSchema";
import { getEventById, updateEvent } from "@/services/eventsService";
import { getAll, OrganizerResponse } from "@/services/organizersService"
import { Loader2, ArrowLeft, Edit, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [organizers, setOrganizers] = useState<OrganizerResponse[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    async function fetchEvent() {
      try {
        if (!token) return;

        const data = await getEventById(token, id as string);
        const organizersResponse = await getAll(token);

        const formattedData: EventFormData = {
          ...data,
          startDatetime: new Date(data.startDatetime),
          endDatetime: new Date(data.endDatetime),
          registrationStartDate: new Date(data.registrationStartDate),
          registrationDeadline: new Date(data.registrationDeadline),
          finalDatePayment: data.finalDatePayment
            ? new Date(data.finalDatePayment)
            : undefined,
          batches: data.batches?.map((batch) => ({
            ...batch,
            startDate: new Date(batch.startDate),
            endDate: new Date(batch.endDate),
          }))
        };

        setEventData(formattedData);
        setOrganizers(organizersResponse);
      } catch (error: any) {
        toast.error(`Erro ao carregar o evento. Causa: ${error.message}`);
        router.push("/events/list");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchEvent();
  }, [id, router]);

  const handleUpdate = async (data: EventFormData) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    setSubmitting(true);
    try {
      if (!token) return;

      // Transformar dados para o formato esperado pelo serviço
      const eventData = {
        ...data,
        organizerId: data.organizer.id,
        batches: data.batches?.map(batch => ({
          ...batch,
          id: batch.id || "" // Manter ID existente ou usar string vazia para novos
        })) || []
      };

      await updateEvent(token, id as string, eventData);
      toast.success("Evento atualizado com sucesso!");
      router.push("/events/list");
    } catch (error: any) {
      toast.error(`Erro ao atualizar o evento. Causa: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-orange-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando evento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/events/list">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Edit className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Editar Evento</h1>
              <p className="text-neutral-400 text-sm">
                {eventData?.name || "Atualize as informações do evento"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <EventForm
          defaultValues={eventData}
          onSubmit={handleUpdate}
          isSubmitting={submitting}
          organizers={organizers}
        />

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-400">
          <p>
            Modifique os campos necessários e salve as alterações.{" "}
            <Link 
              href="/events/list" 
              className="text-orange-400 hover:text-orange-300 underline"
            >
              Voltar para a lista de eventos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
