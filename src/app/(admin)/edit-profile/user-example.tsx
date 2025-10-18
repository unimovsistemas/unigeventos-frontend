/**
 * EXEMPLO: Página de edição de perfil para usuário comum (futuro)
 * 
 * Quando criar a área (user), copie este arquivo para:
 * src/app/(user)/edit-profile/page.tsx
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { getCurrentUserPerson } from "@/services/profileService";
import { PersonResponse } from "@/services/personService";

export default function UserEditProfilePage() {
  const router = useRouter();
  const [person, setPerson] = useState<PersonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await getCurrentUserPerson(token);
        setPerson(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar perfil";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSuccess = () => {
    router.push("/profile");
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/")} className="bg-orange-500">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  if (!person) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg">
              <Edit className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Editar Perfil
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Atualize suas informações pessoais
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Edit Form - Note: theme="light" */}
        <ProfileEditForm 
          person={person} 
          theme="light" 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
