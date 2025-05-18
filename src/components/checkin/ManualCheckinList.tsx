/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  checkin,
  getSubscriptionsByEvent,
  SubscriptionsByEventResponse,
} from "@/services/registrationService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  eventId: string;
}

export default function ManualCheckinList({ eventId }: Props) {
  const [registrations, setRegistrations] = useState<
    SubscriptionsByEventResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    setAccessToken(token!);

    const validateAccess = () => {
      if (!accessToken) {
        throw new Error("Usuário não autorizado para realizar esta ação!");
      }
    };

    async function fetchRegistrations() {
      setLoading(true);
      try {
        validateAccess();
        const result = await getSubscriptionsByEvent(token!, eventId);
        setRegistrations(result);
      } catch (err: any) {
        toast.error(`Erro ao carregar inscrições. Causa: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchRegistrations();
  }, [eventId, registrations, accessToken]);

  const handleCheckin = async (registrationId: string) => {
    try {
      if (!accessToken) {
        throw new Error("Usuário não autorizado para realizar esta ação!");
      }
      
      await checkin(accessToken!, registrationId);
      toast.success("Check-in realizado!");
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === registrationId ? { ...reg, status: "CONFIRMED" } : reg
        )
      );
    } catch (err: any) {
      toast.error(`Erro ao confirmar check-in. Causa: ${err.message}`);
    }
  };

  if (!eventId) return null;

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">Carregando inscrições...</p>
    );

  return (
    <div className="mt-6 border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transporte</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => (
            <TableRow key={reg.id}>
              <TableCell>{reg.personName}</TableCell>
              <TableCell>{reg.status}</TableCell>
              <TableCell>{reg.transportationType}</TableCell>
              <TableCell>R$ {reg.amountPaid.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button
                  disabled={reg.status === "CONFIRMED"}
                  onClick={() => handleCheckin(reg.id)}
                >
                  {reg.status === "CONFIRMED" ? "Feito" : "Fazer check-in"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
