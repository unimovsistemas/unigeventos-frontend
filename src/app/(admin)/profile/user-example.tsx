/**
 * EXEMPLO: Página de perfil para usuário comum (futuro)
 * 
 * Quando criar a área (user), copie este arquivo para:
 * src/app/(user)/profile/page.tsx
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Edit, ArrowLeft, Loader2 } from "lucide-react";
import ProfileView from "@/components/profile/ProfileView";
import { getCurrentUserPerson } from "@/services/profileService";
import { PersonResponse } from "@/services/personService";

export default function UserProfilePage() {
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
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Meu Perfil
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Visualize suas informações pessoais
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Link href="/edit-profile">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Content - Note: theme="light" and showLoginInfo={false} */}
        <ProfileView person={person} theme="light" showLoginInfo={false} />
      </div>
    </div>
  );
}
