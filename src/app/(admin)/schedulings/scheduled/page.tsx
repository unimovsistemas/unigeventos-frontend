/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getUserNotifications, subscribeToNotification, unsubscribeFromNotification } from "@/services/schedulingService";

const NOTIFICATIONS = [
  {
    type: "BIRTHDAY_REMINDER",
    name: "Lembrete de Aniversários",
    description: "Receba lembretes do(s) aniversariante(s) do dia por e-mail.",
  },
  {
    type: "EVENT_STATISTICS",
    name: "Estatísticas de Eventos",
    description: "Receba um resumo do(s) evento(s) realizado(s) no dia seguinte após a conclusão.",
  },
];

interface NotificationStatus {
  notificationType: "BIRTHDAY_REMINDER" | "EVENT_STATISTICS";
  isActive: boolean;
}

export default function ScheduledPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<NotificationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token de acesso não encontrado.");
      return;
    }
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
  
    async function fetchData() {
      try {
        const data = await getUserNotifications(accessToken!);
        setSubscriptions(data);
      } catch (err: any) {
        toast.error(`Erro ao buscar os agendamentos. Causa: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [accessToken]);

  const isSubscribed = (type: string) =>
    subscriptions.find((s) => s.notificationType === type)?.isActive ?? false;

  const handleSubscribe = async (type: string) => {
    setUpdating(type);
    try {
      await subscribeToNotification(accessToken!, type);
      toast.success("Inscrição realizada com sucesso.");
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.notificationType === type ? { ...s, isActive: true } : s
        )
      );
    } catch {
      toast.error("Erro ao inscrever-se.");
    } finally {
      setUpdating(null);
    }
  };
  

  const handleUnsubscribe = async (type: string) => {
    setUpdating(type);
    try {
      await unsubscribeFromNotification(accessToken!, type);
      toast.success("Inscrição removida.");
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.notificationType === type ? { ...s, isActive: false } : s
        )
      );
    } catch {
      toast.error("Erro ao remover inscrição.");
    } finally {
      setUpdating(null);
    }
  };
  

  if (loading || !accessToken) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">
        Agendamentos disponíveis
      </h1>

      {NOTIFICATIONS.map((notif) => {
        const subscribed = isSubscribed(notif.type);

        return (
          <div
            key={notif.type}
            className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-md"
          >
            <h2 className="flex gap-2 items-center justify-between text-xl font-semibold text-orange-300">
              {notif.name}
            </h2>
            <p className="text-sm text-neutral-300 mb-4 mt-2">{notif.description}</p>

            <Button
          onClick={() =>
            subscribed
              ? handleUnsubscribe(notif.type)
              : handleSubscribe(notif.type)
          }
          disabled={updating === notif.type}
          className={`w-full sm:w-auto font-semibold px-4 py-2 rounded-md transition-colors duration-300 shadow-md ${
            subscribed
              ? "bg-[#f5f5f4] text-[#1c1917] hover:bg-[#e7e5e4]"
              : "bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white hover:from-[#c2410c] hover:to-[#b91c1c]"
          }`}
        >
          {updating === notif.type ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : subscribed ? (
            "Desativar"
          ) : (
            "Inscrever-se"
          )}
        </Button>
          </div>
        );
      })}
    </div>
  );
}