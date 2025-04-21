/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/events/EventForm";
import { EventFormData } from "@/schemas/eventSchema";
import { getEventById, updateEvent } from "@/services/eventsService";
import { getAll, OrganizerResponse } from "@/services/organizersService"
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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
        router.push("/events");
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

      await updateEvent(token, id as string, data);
      toast.success("Evento atualizado com sucesso!");
      router.push("/events");
    } catch (error: any) {
      toast.error(`Erro ao atualizar o evento. Causa: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !eventData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando evento...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Editar Evento</h1>
      <EventForm
        defaultValues={eventData}
        onSubmit={handleUpdate}
        isSubmitting={submitting}
        organizers={organizers}
      />
    </div>
  );
}
