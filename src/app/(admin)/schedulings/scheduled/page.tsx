/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const NOTIFICATIONS = [
  {
    type: "BIRTHDAY_REMINDER",
    name: "Lembrete de Aniversários",
    description: "Receba lembretes dos aniversariantes do mês por e-mail.",
  },
  {
    type: "EVENT_STATISTICS",
    name: "Estatísticas de Eventos",
    description: "Receba um resumo mensal dos eventos realizados.",
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
        const response = await fetch(
          `http://localhost:8001/rest/v1/schedulings/queries/get-user-notifications`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setSubscriptions(data);
      } catch (err: any) {
        toast.error(`Erro ao buscar os agendamentos. Causa ${err.message}`);
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
      await fetch(`http://localhost:8001/rest/v1/schedulings/actions/subscribe-user-to-notification?notificationType=${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      await fetch(`http://localhost:8001/rest/v1/schedulings/actions/unsubscribe-user-from-notification?notificationType=${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
            className="bg-white rounded-xl shadow p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {notif.name}
            </h2>
            <p className="text-gray-600 mb-4">{notif.description}</p>

            <Button
              onClick={() =>
                subscribed
                  ? handleUnsubscribe(notif.type)
                  : handleSubscribe(notif.type)
              }
              variant={subscribed ? "destructive" : "default"}
              disabled={updating === notif.type}
              className="w-full sm:w-auto"
            >
              {updating === notif.type ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : subscribed ? (
                "Remover inscrição"
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