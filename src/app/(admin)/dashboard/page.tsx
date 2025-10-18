'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, UserPlus, CalendarPlus, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 text-neutral-200">
      <h1 className="text-3xl font-bold text-orange-400">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<CalendarPlus className="text-orange-500" size={28} />}
          title="Eventos Ativos"
          value="12"
        />
        <StatCard
          icon={<UserPlus className="text-red-500" size={28} />}
          title="Inscritos Hoje"
          value="87"
        />
        <StatCard
          icon={<Activity className="text-yellow-500" size={28} />}
          title="Check-ins Realizados"
          value="53"
        />
        <StatCard
          icon={<BarChart3 className="text-purple-500" size={28} />}
          title="Eventos Concluídos"
          value="34"
        />
      </div>

      <div className="bg-[#2b2b2b] rounded-xl shadow p-6 border border-[#333]">
        <h2 className="text-xl font-semibold text-orange-300 mb-4">Resumo Geral</h2>
        <p className="text-neutral-400">
          Aqui você pode visualizar os principais indicadores dos eventos em andamento, número de inscritos,
          check-ins e progresso geral da plataforma. Em breve, gráficos interativos serão exibidos aqui.
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card className="bg-[#2b2b2b] border border-[#333] rounded-2xl hover:shadow-md transition-all">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="bg-black/30 p-3 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-sm text-neutral-400">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-100">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
