"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { 
  User, Mail, Phone, Calendar, Heart, Church, 
  Shirt, Music, IdCard, Loader2, CheckCircle2, XCircle, Upload
} from "lucide-react";
import { updateCurrentUserPerson, uploadProfilePhoto, UpdatePersonPayload } from "@/services/profileService";
import { 
  genderTypeLabels, 
  maritalStatusTypeLabels, 
  choralVoiceTypeLabels 
} from "@/services/personService";
import { toast } from "react-toastify";

interface ProfileEditFormProps {
  person: {
    id: string;
    name: string;
    photo?: string;
    birthdate: Date;
    gender: string;
    maritalStatus: string;
    church: string;
    clothingSize: string;
    choralVoiceType: string;
    personalContactEmail?: string;
    contact?: {
      phoneNumber: string;
    };
    document?: {
      number: string;
      documentType: string;
    };
  };
  theme?: "dark" | "light";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({ 
  person, 
  theme = "dark", 
  onSuccess,
  onCancel 
}: ProfileEditFormProps) {
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [formData, setFormData] = useState({
    name: person.name,
    birthdate: person.birthdate.toString(),
    gender: person.gender,
    maritalStatus: person.maritalStatus,
    church: person.church,
    clothingSize: person.clothingSize,
    choralVoiceType: person.choralVoiceType,
    phoneNumber: person.contact?.phoneNumber || "",
    documentNumber: person.document?.number || "",
    personalContactEmail: person.contact?.email || "",
  });

  const [photoPreview, setPhotoPreview] = useState(person.photo || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cardClass = isDark
    ? "bg-[#2b2b2b] border-[#444] text-neutral-200 shadow-lg"
    : "bg-white border-gray-200 text-gray-900 shadow-lg";

  const inputClass = isDark
    ? "bg-[#1a1a1a] border-[#404040] text-neutral-100 placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500/20 hover:border-[#505050] transition-all duration-200"
    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 hover:border-gray-400 transition-all duration-200";

  const selectClass = isDark
    ? "bg-[#1a1a1a] border-[#404040] text-neutral-100 focus:border-orange-500 focus:ring-orange-500/20 hover:border-[#505050] transition-all duration-200"
    : "bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500/20 hover:border-gray-400 transition-all duration-200";

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Tamanho máximo: 5MB");
        e.target.value = "";
        return;
      }

      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        e.target.value = "";
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.onerror = () => {
        toast.error("Erro ao processar a imagem selecionada");
      };
      reader.readAsDataURL(file);
      toast.success("Imagem selecionada com sucesso!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      // Upload da foto primeiro, se houver
      if (photoFile) {
        await uploadProfilePhoto(token, photoFile);
        toast.success("Foto de perfil enviada com sucesso!");
      }

      // Atualizar dados do perfil
      const payload: UpdatePersonPayload = {
        name: formData.name,
        birthdate: formData.birthdate,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        church: formData.church,
        clothingSize: formData.clothingSize,
        choralVoiceType: formData.choralVoiceType,
        phoneNumber: formData.phoneNumber,
        documentNumber: formData.documentNumber,
        personalContactEmail: formData.personalContactEmail,
      };

      await updateCurrentUserPerson(token, payload);

      setSuccess("Perfil atualizado com sucesso!");
      toast.success("Perfil atualizado com sucesso!");
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/profile");
        }
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500">
          <XCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/50 text-green-500">
          <CheckCircle2 size={18} />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Photo Upload */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Foto de Perfil
          </CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Escolha uma foto que represente você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Avatar
                src={photoPreview || undefined}
                alt={formData.name}
                className="h-32 w-32 border-4 border-orange-500 shadow-lg"
              />
              {photoFile && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            <Label
              htmlFor="photo"
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Upload className="h-4 w-4" />
              {photoFile ? "Alterar Foto" : "Escolher Foto"}
            </Label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoFile && (
              <p className="text-sm text-green-500 font-medium">
                Nova foto selecionada!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Informações Pessoais
          </CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Dados básicos do seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome Completo - Largura Total */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-orange-500" />
              Nome Completo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`${inputClass} h-12`}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          {/* Data de Nascimento e Gênero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label htmlFor="birthdate" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Data de Nascimento *
              </Label>
              <Input
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) => handleChange("birthdate", e.target.value)}
                className={`${inputClass} h-12`}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="gender" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-orange-500" />
                Gênero *
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={`${selectClass} h-12 rounded-xl px-4 py-3 cursor-pointer`}
                required
              >
                {Object.entries(genderTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado Civil */}
          <div className="space-y-3">
            <Label htmlFor="maritalStatus" className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-orange-500" />
              Estado Civil *
            </Label>
            <select
              id="maritalStatus"
              value={formData.maritalStatus}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              className={`${selectClass} h-12 rounded-xl px-4 py-3 cursor-pointer`}
              required
            >
              {Object.entries(maritalStatusTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-orange-500" />
            Informações de Contato
          </CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Como podemos entrar em contato com você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email - Largura Total */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-orange-500" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.personalContactEmail}
              onChange={(e) => handleChange("personalContactEmail", e.target.value)}
              className={`${inputClass} h-12`}
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Telefone e Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-orange-500" />
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={`${inputClass} h-12`}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="document" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <IdCard className="h-4 w-4 text-orange-500" />
                Documento (CPF)
              </Label>
              <Input
                id="document"
                value={formData.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                className={`${inputClass} h-12`}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Church Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5 text-orange-500" />
            Informações da Igreja
          </CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Informações relacionadas à sua participação na comunidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Igreja - Largura Total */}
          <div className="space-y-3">
            <Label htmlFor="church" className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Church className="h-4 w-4 text-orange-500" />
              Igreja *
            </Label>
            <Input
              id="church"
              value={formData.church}
              onChange={(e) => handleChange("church", e.target.value)}
              className={`${inputClass} h-12`}
              placeholder="Nome da sua igreja"
              required
            />
          </div>

          {/* Tamanho de Roupa e Voz Coral */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="clothingSize" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Shirt className="h-4 w-4 text-orange-500" />
                Tamanho de Roupa
              </Label>
              <Input
                id="clothingSize"
                value={formData.clothingSize}
                onChange={(e) => handleChange("clothingSize", e.target.value)}
                className={`${inputClass} h-12`}
                placeholder="Ex: P, M, G, GG"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="choralVoice" className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Music className="h-4 w-4 text-orange-500" />
                Voz Coral
              </Label>
              <select
                id="choralVoice"
                value={formData.choralVoiceType}
                onChange={(e) => handleChange("choralVoiceType", e.target.value)}
                className={`${selectClass} h-12 rounded-xl px-4 py-3 cursor-pointer`}
              >
                {Object.entries(choralVoiceTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Salvando alterações...
            </div>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => router.push("/profile"))}
          disabled={isLoading}
          className={`flex-1 h-12 font-medium transition-all duration-200 ${
            isDark 
              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600 hover:border-neutral-500" 
              : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400"
          }`}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
