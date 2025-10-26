/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EventForm } from "@/components/events/EventForm";
import { EventFormData } from "@/schemas/eventSchema";
import { createEvent } from "@/services/eventsService";
import { getAll, OrganizerResponse } from "@/services/organizersService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Calendar, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  const router = useRouter();
  const [organizers, setOrganizers] = useState<OrganizerResponse[] | []>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      async function fetchOrganizers() {
        try {
          const organizersResponse = await getAll();
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
      // Transformar dados para o formato esperado pelo serviço
      const eventData = {
        ...data,
        organizerId: data.organizer.id,
        batches: data.batches?.map(batch => ({
          ...batch,
          id: "" // Para criação, o ID será gerado pelo backend
        })) || []
      };

      await createEvent(eventData);
      toast.success("Evento criado com sucesso!");
      router.push("/admin/events/list");
    } catch (err: any) {
      toast.error(`Erro ao criar evento. Causa: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-orange-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando organizadores...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/events/list">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Plus className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Novo Evento</h1>
              <p className="text-neutral-400 text-sm">
                Crie um novo evento preenchendo as informações abaixo
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <EventForm onSubmit={handleSubmit} organizers={organizers} />

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-400">
          <p>
            Preencha todos os campos obrigatórios para criar o evento.{" "}
            <Link 
              href="/admin/events/list" 
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