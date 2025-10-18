"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, Phone, Calendar, Heart, Church, 
  Shirt, Music, IdCard, Shield 
} from "lucide-react";
import { 
  genderTypeLabels, 
  maritalStatusTypeLabels, 
  choralVoiceTypeLabels,
  roleTypeLabels 
} from "@/services/personService";

interface ProfileViewProps {
  person: {
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
    login?: {
      username: string;
      roles?: Array<{ role: string }>;
    };
  };
  theme?: "dark" | "light";
  showLoginInfo?: boolean;
}

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  theme: "dark" | "light";
}

const InfoItem = ({ icon, label, value, theme }: InfoItemProps) => {
  const isDark = theme === "dark";
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-opacity-50 hover:bg-opacity-70 transition-all">
      <div className={`flex-shrink-0 p-2 rounded-lg ${
        isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
          {label}
        </p>
        <p className={`text-sm font-semibold mt-0.5 break-words ${
          isDark ? "text-neutral-200" : "text-gray-900"
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default function ProfileView({ person, theme = "dark", showLoginInfo = false }: ProfileViewProps) {
  const isDark = theme === "dark";
  
  const cardClass = isDark
    ? "bg-[#2b2b2b] border-[#444] text-neutral-200"
    : "bg-white border-gray-200 text-gray-900";

  const formatDate = (dateString: Date) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateAge = (birthdate: Date) => {
    const today = new Date();
    const birth = new Date(birthdate + "T00:00:00");
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className={cardClass}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar
              src={person.photo || undefined}
              alt={person.name}
              className="h-32 w-32 border-4 border-orange-500"
            />
            <div>
              <h2 className="text-2xl font-bold">{person.name}</h2>
              {person.personalContactEmail && (
                <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                  {person.personalContactEmail}
                </p>
              )}
            </div>
            {showLoginInfo && person.login?.roles && (
              <div className="flex flex-wrap gap-2 justify-center">
                {person.login.roles.map((role, index) => (
                  <Badge
                    key={index}
                    className={`${
                      isDark 
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30" 
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {roleTypeLabels[role.role] || role.role}
                  </Badge>
                ))}
              </div>
            )}
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
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Dados pessoais e de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="Gênero"
            value={genderTypeLabels[person.gender] || person.gender}
            theme={theme}
          />
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Data de Nascimento"
            value={`${formatDate(person.birthdate)} (${calculateAge(person.birthdate)} anos)`}
            theme={theme}
          />
          <InfoItem
            icon={<Heart className="h-4 w-4" />}
            label="Estado Civil"
            value={maritalStatusTypeLabels[person.maritalStatus] || person.maritalStatus}
            theme={theme}
          />
          {person.contact?.phoneNumber && (
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Telefone"
              value={person.contact.phoneNumber}
              theme={theme}
            />
          )}
          {person.personalContactEmail && (
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={person.personalContactEmail}
              theme={theme}
            />
          )}
          {person.document?.number && (
            <InfoItem
              icon={<IdCard className="h-4 w-4" />}
              label="Documento"
              value={`${person.document.documentType}: ${person.document.number}`}
              theme={theme}
            />
          )}
        </CardContent>
      </Card>

      {/* Church Information */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            Informações da Igreja
          </CardTitle>
          <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
            Dados relacionados à comunidade
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={<Church className="h-4 w-4" />}
            label="Igreja"
            value={person.church || "Não informado"}
            theme={theme}
          />
          <InfoItem
            icon={<Shirt className="h-4 w-4" />}
            label="Tamanho de Roupa"
            value={person.clothingSize || "Não informado"}
            theme={theme}
          />
          <InfoItem
            icon={<Music className="h-4 w-4" />}
            label="Voz Coral"
            value={choralVoiceTypeLabels[person.choralVoiceType] || person.choralVoiceType}
            theme={theme}
          />
        </CardContent>
      </Card>

      {/* Login Information - Only if showLoginInfo is true */}
      {showLoginInfo && person.login && (
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informações de Acesso
            </CardTitle>
            <CardDescription className={isDark ? "text-neutral-400" : "text-gray-600"}>
              Dados de login e permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Nome de Usuário"
              value={person.login.username}
              theme={theme}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
