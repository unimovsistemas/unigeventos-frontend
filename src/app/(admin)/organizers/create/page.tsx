/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OrganizerForm } from "@/components/organizers/OrganizerForm";
import { OrganizerFormData } from "@/schemas/organizerSchema";
import { createOrganizer } from "@/services/organizersService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateOrganizerPage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      if (!token) return;

      await createOrganizer(token, data);
      toast.success("Organizador criado com sucesso!");
      router.push("/organizers/list");
    } catch (err: any) {
      toast.error(`Erro ao criar organizador. Causa: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold text-orange-400">Novo Organizador</h1>
      <OrganizerForm onSubmit={handleSubmit} />
    </div>
  );
}
