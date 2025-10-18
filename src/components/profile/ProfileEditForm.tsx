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
    personalContactEmail: person.personalContactEmail || "",
  });

  const [photoPreview, setPhotoPreview] = useState(person.photo || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cardClass = isDark
    ? "bg-[#2b2b2b] border-[#444] text-neutral-200"
    : "bg-white border-gray-200 text-gray-900";

  const inputClass = isDark
    ? "bg-[#1e1e1e] border-[#444] text-neutral-200"
    : "bg-white border-gray-300 text-gray-900";

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Atualize sua foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={photoPreview || undefined}
              alt={formData.name}
              className="h-32 w-32 border-4 border-orange-500"
            />
            <Label
              htmlFor="photo"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              <Upload className="h-4 w-4" />
              Escolher Foto
            </Label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Data de Nascimento *</Label>
              <Input
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={(e) => handleChange("birthdate", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero *</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${inputClass}`}
                required
              >
                {Object.entries(genderTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Estado Civil *</Label>
              <select
                id="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${inputClass}`}
                required
              >
                {Object.entries(maritalStatusTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalContactEmail}
                onChange={(e) => handleChange("personalContactEmail", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={inputClass}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Documento (CPF)</Label>
              <Input
                id="document"
                value={formData.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                className={inputClass}
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
            <Church className="h-5 w-5" />
            Informações da Igreja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="church">Igreja *</Label>
              <Input
                id="church"
                value={formData.church}
                onChange={(e) => handleChange("church", e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clothingSize">Tamanho de Roupa</Label>
              <Input
                id="clothingSize"
                value={formData.clothingSize}
                onChange={(e) => handleChange("clothingSize", e.target.value)}
                className={inputClass}
                placeholder="Ex: M, G, GG"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="choralVoice">Voz Coral</Label>
              <select
                id="choralVoice"
                value={formData.choralVoiceType}
                onChange={(e) => handleChange("choralVoiceType", e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${inputClass}`}
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
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </div>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => router.push("/profile"))}
          disabled={isLoading}
          className={isDark 
            ? "flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600" 
            : "flex-1 bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
          }
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
