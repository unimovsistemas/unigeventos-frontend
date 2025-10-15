/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import QRCodeScanner from "@/components/checkin/QRCodeScanner";
import { toast } from "react-toastify";
import { checkin } from "@/services/registrationService";
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User,
  TrendingUp,
  Calendar
} from "lucide-react";

interface CheckinRecord {
  id: string;
  registrationId: string;
  timestamp: Date;
  status: "success" | "error";
  message: string;
}

export default function CheckinsPage() {
  const [checkinHistory, setCheckinHistory] = useState<CheckinRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
  });

  const handleQRCheckin = async (registrationId: string) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

      if (!token) {
        const errorRecord: CheckinRecord = {
          id: Date.now().toString(),
          registrationId,
          timestamp: new Date(),
          status: "error",
          message: "Usuário não autorizado",
        };
        setCheckinHistory((prev) => [errorRecord, ...prev]);
        setStats((prev) => ({ ...prev, total: prev.total + 1, error: prev.error + 1 }));
        toast.error("Usuário não autorizado para realizar esta ação!");
        return;
      }

      await checkin(token, registrationId);
      
      const successRecord: CheckinRecord = {
        id: Date.now().toString(),
        registrationId,
        timestamp: new Date(),
        status: "success",
        message: "Check-in realizado com sucesso",
      };
      
      setCheckinHistory((prev) => [successRecord, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
      toast.success("Check-in realizado com sucesso!");
    } catch (error: any) {
      const errorMessage = error.message || "Erro desconhecido";
      const errorRecord: CheckinRecord = {
        id: Date.now().toString(),
        registrationId,
        timestamp: new Date(),
        status: "error",
        message: errorMessage,
      };
      
      setCheckinHistory((prev) => [errorRecord, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, error: prev.error + 1 }));
      toast.error(`Erro ao fazer check-in: ${errorMessage}`);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const clearHistory = () => {
    setCheckinHistory([]);
    setStats({ total: 0, success: 0, error: 0 });
    toast.info("Histórico limpo");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
              <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-400 truncate">
                Check-in de Participantes
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                Leia o QR Code para realizar o check-in automaticamente
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-xs">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-xs">Sucesso</p>
                <p className="text-2xl font-bold text-green-400">{stats.success}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-xs">Erros</p>
                <p className="text-2xl font-bold text-red-400">{stats.error}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* QR Code Scanner */}
        <Card className="bg-gradient-to-br from-[#222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <QrCode className="text-orange-400" size={24} />
              <h2 className="text-xl font-semibold text-orange-300">
                Scanner de QR Code
              </h2>
            </div>
            <p className="text-sm text-neutral-400 mb-6">
              Aponte a câmera para o QR Code do participante. O check-in será processado automaticamente.
            </p>
            <QRCodeScanner onDetected={handleQRCheckin} />
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card className="bg-gradient-to-br from-[#222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="text-orange-400" size={24} />
                <h2 className="text-xl font-semibold text-orange-300">
                  Histórico da Sessão
                </h2>
              </div>
              {checkinHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-neutral-400 hover:text-orange-400 transition-colors"
                >
                  Limpar Histórico
                </button>
              )}
            </div>

            {checkinHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-neutral-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-400 text-sm">
                  Nenhum check-in realizado nesta sessão
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {checkinHistory.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.status === "success"
                        ? "bg-green-600/10 border-green-600/30"
                        : "bg-red-600/10 border-red-600/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {record.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-white truncate flex items-center gap-2">
                            <User className="h-3 w-3" />
                            ID: {record.registrationId}
                          </p>
                          <span className="text-xs text-neutral-400 whitespace-nowrap">
                            {formatTime(record.timestamp)}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${
                            record.status === "success"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {record.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}