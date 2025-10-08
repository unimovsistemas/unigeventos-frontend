/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OrganizerForm } from "@/components/organizers/OrganizerForm";
import { OrganizerFormData } from "@/schemas/organizerSchema";
import Link from "next/link";
import { ArrowLeft, UserCheck, Users, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useOrganizer } from "@/hooks/useOrganizers";

export default function EditOrganizerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    organizer, 
    loading, 
    error, 
    updateOrganizerMutation,
    fetchOrganizer
  } = useOrganizer(id);

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      setIsSubmitting(true);
      await updateOrganizerMutation(data);
      router.push("/organizers/list");
    } catch (err: any) {
      console.error("Error updating organizer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    fetchOrganizer();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <Loading size="lg" text="Carregando organizador..." className="mt-20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/organizers/list">
              <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Card className="p-8 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-red-700/50 text-center">
            <div className="p-4 bg-red-600/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Erro ao Carregar Organizador
            </h2>
            <p className="text-neutral-400 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleRetry}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Link href="/organizers/list">
                <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600">
                  Voltar à Lista
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/organizers/list">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <UserCheck className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Editar Organizador</h1>
              <p className="text-neutral-400 text-sm">
                Atualize as informações do organizador{organizer?.name && `: ${organizer.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-700">
              <Users className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-orange-300">
                Informações do Organizador
              </h2>
            </div>
            
            {organizer && (
              <OrganizerForm 
                onSubmit={handleSubmit} 
                defaultValues={organizer} 
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-400">
          <p>
            Todas as alterações serão salvas permanentemente.{" "}
            <Link 
              href="/organizers/list" 
              className="text-orange-400 hover:text-orange-300 underline"
            >
              Cancelar e voltar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
