/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(admin)/checkins/list/page.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import QRCodeScanner from "@/components/checkin/QRCodeScanner";
import { toast } from "react-toastify";
import { checkin } from "@/services/registrationService";
import { QrCode } from "lucide-react"; // ícone opcional

const handleQRCheckin = async (registrationId: string) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    if (!token) {
      toast.error("Usuário não autorizado para realizar esta ação!");
      return;
    }

    await checkin(token, registrationId);
    toast.success("Check-in realizado com sucesso!");  
  } catch (error: any) {
    toast.error(`Erro ao fazer check-in. Causa: ${error.message}`);
  }
};

export default function CheckinsPage() {
  return (
    <main className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">
          Check-in de Participantes
        </h1>
      </div>

      <Card className="bg-gradient-to-br from-[#222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <QrCode className="text-orange-400" size={24} />
            <h2 className="text-xl font-semibold text-orange-300">
              Leitura de QRCode
            </h2>
          </div>
          <p className="text-sm text-neutral-400 mb-4">
            Aponte a câmera para o QRCode do participante para realizar o check-in automaticamente.
          </p>
          <QRCodeScanner onDetected={handleQRCheckin} />
        </CardContent>
      </Card>
    </main>
  );
}