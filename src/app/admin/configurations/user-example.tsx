/**
 * EXEMPLO: Futuro uso da tela de configurações para usuário comum
 * 
 * Este arquivo demonstra como a mesma estrutura de configurações
 * pode ser reutilizada para usuários comuns com tema light.
 * 
 * Para implementar, basta:
 * 1. Criar a rota: src/app/(user)/configurations/page.tsx
 * 2. Copiar este código para lá
 * 3. Ajustar conforme necessário
 */

"use client";

import { Lock, Bell, User } from "lucide-react";
import ConfigurationLayout, { ConfigurationTab } from "@/components/settings/ConfigurationLayout";
import PasswordResetSection from "@/components/settings/PasswordResetSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserConfigurationsPage() {
  // Componente de perfil do usuário
  const ProfileSection = () => (
    <Card className="bg-white border-gray-200 text-gray-900">
      <CardHeader>
        <CardTitle className="text-xl">Perfil do Usuário</CardTitle>
        <CardDescription className="text-gray-600">
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Em breve você poderá editar suas informações pessoais aqui.
        </p>
      </CardContent>
    </Card>
  );

  const NotificationsSection = () => (
    <Card className="bg-white border-gray-200 text-gray-900">
      <CardHeader>
        <CardTitle className="text-xl">Notificações</CardTitle>
        <CardDescription className="text-gray-600">
          Configure suas preferências de notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          Em breve você poderá configurar suas notificações aqui.
        </p>
      </CardContent>
    </Card>
  );

  // Definir as tabs de configuração para usuário comum
  const configurationTabs: ConfigurationTab[] = [
    {
      id: "profile",
      label: "Perfil",
      icon: <User size={16} />,
      content: <ProfileSection />,
    },
    {
      id: "password",
      label: "Senha",
      icon: <Lock size={16} />,
      content: <PasswordResetSection theme="light" />,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell size={16} />,
      content: <NotificationsSection />,
    },
  ];

  return (
    <ConfigurationLayout
      tabs={configurationTabs}
      defaultTab="profile"
      theme="light"
      userRole="user"
      title="Minhas Configurações"
      description="Gerencie suas preferências pessoais"
    />
  );
}
