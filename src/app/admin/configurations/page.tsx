"use client";

import { Lock, Bell, Shield, Database } from "lucide-react";
import ConfigurationLayout, { ConfigurationTab } from "@/components/settings/ConfigurationLayout";
import PasswordResetSection from "@/components/settings/PasswordResetSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigurationsPage() {
  // Exemplo de componente para futuras configurações
  const NotificationsSection = () => (
    <Card className="bg-[#2b2b2b] border-[#444] text-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl">Notificações</CardTitle>
        <CardDescription className="text-neutral-400">
          Configure suas preferências de notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-400">
          Em breve você poderá configurar suas notificações aqui.
        </p>
      </CardContent>
    </Card>
  );

  const SecuritySection = () => (
    <Card className="bg-[#2b2b2b] border-[#444] text-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl">Segurança</CardTitle>
        <CardDescription className="text-neutral-400">
          Configurações avançadas de segurança
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-400">
          Em breve você poderá configurar opções de segurança adicionais aqui.
        </p>
      </CardContent>
    </Card>
  );

  const SystemSection = () => (
    <Card className="bg-[#2b2b2b] border-[#444] text-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl">Sistema</CardTitle>
        <CardDescription className="text-neutral-400">
          Configurações do sistema (exclusivo para administradores)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-400">
          Em breve você poderá configurar opções do sistema aqui.
        </p>
      </CardContent>
    </Card>
  );

  // Definir as tabs de configuração
  const configurationTabs: ConfigurationTab[] = [
    {
      id: "password",
      label: "Senha",
      icon: <Lock size={16} />,
      content: <PasswordResetSection theme="dark" />,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell size={16} />,
      content: <NotificationsSection />,
    },
    {
      id: "security",
      label: "Segurança",
      icon: <Shield size={16} />,
      content: <SecuritySection />,
    },
    {
      id: "system",
      label: "Sistema",
      icon: <Database size={16} />,
      content: <SystemSection />,
      adminOnly: true, // Apenas administradores verão esta tab
    },
  ];

  return (
    <ConfigurationLayout
      tabs={configurationTabs}
      defaultTab="password"
      theme="dark"
      userRole="admin"
      title="Configurações do Administrador"
      description="Gerencie suas configurações pessoais e do sistema"
    />
  );
}
