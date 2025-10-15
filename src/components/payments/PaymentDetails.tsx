/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  User,
  Calendar,
  CreditCard,
  DollarSign,
  Receipt,
  Building2,
  Hash,
  Clock,
  Ticket,
} from "lucide-react";

interface PaymentDetailsProps {
  payment: {
    id: string;
    registration: {
      personName: string;
      eventName: string;
    };
    paymentType: string;
    status: string;
    provider: string;
    amount: number;
    paymentDate: string;
    installments: number;
  };
}

const providerTypeLabels: Record<string, string> = {
  AD_EVENTOS: "AD Eventos",
  PAG_HIPER: "PagHiper",
  USE_REDE: "e.Rede (Itaú)",
  PAGAR_ME: "Pagar.me",
};

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const installmentAmount = payment.amount / payment.installments;

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-orange-400 mb-2">Detalhes do Pagamento</h3>
          <p className="text-sm text-neutral-400">ID: {payment.id}</p>
        </div>
        <StatusBadge status={payment.status} type="status" />
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Participante */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <User className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Participante</p>
              <p className="text-base font-semibold text-white break-words">
                {payment.registration.personName}
              </p>
            </div>
          </div>
        </Card>

        {/* Evento */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Ticket className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Evento</p>
              <p className="text-base font-semibold text-white break-words">
                {payment.registration.eventName}
              </p>
            </div>
          </div>
        </Card>

        {/* Valor Total */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-orange-400">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>
        </Card>

        {/* Parcelas */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Hash className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Parcelas</p>
              <p className="text-xl font-bold text-white">
                {payment.installments}x de {formatCurrency(installmentAmount)}
              </p>
            </div>
          </div>
        </Card>

        {/* Forma de Pagamento */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <CreditCard className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Forma de Pagamento</p>
              <StatusBadge status={payment.paymentType} type="paymentType" />
            </div>
          </div>
        </Card>

        {/* Provedor */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Building2 className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Provedor</p>
              <p className="text-base font-semibold text-white">
                {providerTypeLabels[payment.provider] || payment.provider}
              </p>
            </div>
          </div>
        </Card>

        {/* Data e Hora */}
        <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 mb-1">Data e Hora do Pagamento</p>
              <p className="text-base font-semibold text-white">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card className="p-6 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-orange-600/20 rounded-lg">
            <Receipt className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">Informações Adicionais</h4>
            <p className="text-sm text-neutral-400">Detalhes complementares do pagamento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-400 mb-1">ID da Transação</p>
            <p className="text-sm text-white font-mono break-all">{payment.id}</p>
          </div>
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-xs text-neutral-400 mb-1">Status do Pagamento</p>
            <StatusBadge status={payment.status} type="status" />
          </div>
        </div>
      </Card>
    </div>
  );
}
