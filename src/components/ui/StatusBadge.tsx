import {
  BadgeCheck,
  Clock,
  XCircle,
  Loader2,
  HelpCircle,
  RefreshCcw,
  Ban,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "status" | "paymentType";
}

export default function StatusBadge({ status, type = "status" }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const statusMap = {
    PENDING: {
      label: "Pendente",
      color: "bg-yellow-500",
      Icon: Clock,
    },
    INPROCESS: {
      label: "Processando",
      color: "bg-blue-500",
      Icon: Loader2,
    },
    APPROVED: {
      label: "Aprovado",
      color: "bg-green-600",
      Icon: BadgeCheck,
    },
    REJECTED: {
      label: "Rejeitado",
      color: "bg-red-500",
      Icon: XCircle,
    },
    FAILED: {
      label: "Falha",
      color: "bg-red-700",
      Icon: AlertTriangle,
    },
    CANCELLED: {
      label: "Cancelado",
      color: "bg-gray-600",
      Icon: Ban,
    },
    REFUNDED: {
      label: "Reembolsado",
      color: "bg-purple-600",
      Icon: RefreshCcw,
    },
    EXPIRED: {
      label: "Expirado",
      color: "bg-orange-500",
      Icon: XCircle,
    },
    CHARGEBACK: {
      label: "Estornado",
      color: "bg-pink-500",
      Icon: RotateCcw,
    },
  };

  const paymentTypeMap = {
    CREDIT_CARD: {
      label: "Crédito",
      color: "bg-purple-600",
      Icon: HelpCircle,
    },
    INVOICE: {
      label: "Boleto",
      color: "bg-zinc-500",
      Icon: HelpCircle,
    },
    PIX: {
      label: "Pix",
      color: "bg-cyan-600",
      Icon: HelpCircle,
    },
  };

  const map = type === "status" ? statusMap : paymentTypeMap;

  const config = map[normalized as keyof typeof map] || {
    label: normalized,
    color: "bg-gray-600",
    Icon: HelpCircle,
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}
      title={`${type === "status" ? "Status" : "Forma"}: ${config.label}`}
    >
      <config.Icon className="mr-1 h-3 w-3" />
      {config.label}
    </div>
  );
}
