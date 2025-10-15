"use client";

import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface ConfigurationTab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

interface ConfigurationLayoutProps {
  tabs: ConfigurationTab[];
  defaultTab?: string;
  theme?: "dark" | "light";
  userRole?: "admin" | "user";
  title?: string;
  description?: string;
}

export default function ConfigurationLayout({
  tabs,
  defaultTab,
  theme = "dark",
  userRole = "admin",
  title = "Configurações",
  description = "Gerencie suas configurações e preferências",
}: ConfigurationLayoutProps) {
  const isDark = theme === "dark";

  // Filtrar tabs baseado no perfil do usuário
  const filteredTabs = tabs.filter((tab) => {
    if (tab.adminOnly && userRole !== "admin") return false;
    if (tab.userOnly && userRole !== "user") return false;
    return true;
  });

  const initialTab = defaultTab || filteredTabs[0]?.id || "";

  const containerClass = isDark
    ? "min-h-screen bg-[#1e1e1e] text-neutral-200"
    : "min-h-screen bg-gray-50 text-gray-900";

  const headerClass = isDark
    ? "bg-[#2b2b2b] border-b border-[#333]"
    : "bg-white border-b border-gray-200";

  return (
    <div className={containerClass}>
      <div className={`${headerClass} px-6 py-6`}>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className={`mt-2 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>

      <div className="p-6">
        <Tabs
          value={initialTab}
          onValueChange={() => {}}
          className="w-full"
        >
          <TabsList className={isDark ? "bg-[#2b2b2b]" : "bg-gray-200"}>
            {filteredTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
