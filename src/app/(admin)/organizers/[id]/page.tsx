/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OrganizerForm } from "@/components/organizers/OrganizerForm";
import { OrganizerFormData } from "@/schemas/organizerSchema";
import { getOrganizerById, updateOrganizer } from "@/services/organizersService";
import { toast } from "sonner";

export default function EditOrganizerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [organizer, setOrganizer] = useState<OrganizerFormData | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  useEffect(() => {
    if (token && id) {
      getOrganizerById(token, id)
        .then(setOrganizer)
        .catch((err: any) => toast.error(`Erro ao carregar organizador ${err.message}`));
    }
  }, [id, token]);

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      if (!token) return;

      await updateOrganizer(token, id!, data);
      toast.success("Organizador atualizado!");
      router.push("/organizers/list");
    } catch (err: any) {
      toast.error(`Erro ao atualizar organizador ${err.message}`);
      console.error(err);
    }
  };

  if (!organizer) return <p className="text-white">Carregando...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold text-orange-400">Editar Organizador</h1>
      <OrganizerForm onSubmit={handleSubmit} defaultValues={organizer} />
    </div>
  );
}
