/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EventForm } from "@/components/events/EventForm";
import { EventFormData } from "@/schemas/eventSchema";
import { createEvent } from "@/services/eventsService";
import { getAll, OrganizerResponse } from "@/services/organizersService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const [organizers, setOrganizers] = useState<OrganizerResponse[] | []>([]);
  const [loading, setLoading] = useState(true);
  
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  
  useEffect(() => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  
      async function fetchOrganizers() {
        try {
          if (!token) return;
  
          const organizersResponse = await getAll(token);
          setOrganizers(organizersResponse);
        } catch (error: any) {
          toast.error(`Erro ao carregar os organizadores. Causa: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }

      fetchOrganizers();
    }, []);

  const handleSubmit = async (data: EventFormData) => {
    try {
      if (!token) return;

      await createEvent(token, data);
      toast.success("Evento criado com sucesso!");
      router.push("/events/list");
    } catch (err: any) {
      toast.error(`Erro ao criar evento. Causa: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-orange-400">Novo Evento</h1>
      <EventForm onSubmit={handleSubmit} organizers={organizers} />
    </div>
  );
}