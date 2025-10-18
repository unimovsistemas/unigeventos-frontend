"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Edit, ArrowLeft, Loader2 } from "lucide-react";
import ProfileView from "@/components/profile/ProfileView";
import { getCurrentUserPerson } from "@/services/profileService";
import { PersonResponse } from "@/services/personService";

export default function ProfilePage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-neutral-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-orange-500">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!person) {
    return null;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400">
                Meu Perfil
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                Visualize suas informações pessoais
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600"
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

        {/* Profile Content */}
        <ProfileView person={person} theme="dark" showLoginInfo={true} />
      </div>
    </div>
  );
}
