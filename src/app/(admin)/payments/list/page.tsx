/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { getPaymentsPage, PageResponse, PaymentResponse } from "@/services/paymentService";
import { applyDiscount } from "@/services/discountService";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";

const providerTypeLabels: Record<string, string> = {
  AD_EVENTOS: "AD Eventos",
  PAG_HIPER: "PagHiper",
  USE_REDE: "e.Rede (Itaú)",
  PAGAR_ME: "Pagar.me",
};

export default function PaymentListPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Token de acesso não encontrado.");
        return;
      }
  
      const response: PageResponse<PaymentResponse> = await getPaymentsPage(token, currentPage);
      setPayments(response.content || []);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const handleDiscount = async (paymentId: string, couponCode: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Token de acesso não encontrado.");
        return;
      }

      await applyDiscount(token, paymentId, couponCode);
      toast.success("Desconto aplicado com sucesso!");
      await fetchPayments(); // <-- Atualiza a listagem automaticamente
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Erro ao aplicar desconto.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-400">Pagamentos</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left text-white">
          <thead>
            <tr className="bg-neutral-800">
              <th className="px-4 py-2 w-[16%]">Participante</th>
              <th className="px-4 py-2 w-[16%]">Evento</th>
              <th className="px-2 py-2 w-[10%]">Status</th>
              <th className="px-2 py-2 w-[12%]">Forma</th>
              <th className="px-2 py-2 w-[10%]">Provedor</th>
              <th className="px-2 py-2 w-[12%]">Valor</th>
              <th className="px-2 py-2 w-[14%]">Data e hora</th>
              <th className="px-2 py-2 w-[6%]">Parcelas</th>
              <th className="px-2 py-2 w-[4%]">Ação</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="bg-neutral-900 border-b border-neutral-700">
                    <td className="px-4 py-3" colSpan={9}>
                      <Skeleton height={24} />
                    </td>
                  </tr>
                ))
              : payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border-b border-neutral-700"
                  >
                    <td className="px-4 py-2 max-w-[180px] truncate" title={payment.registration.personName}>
                      {payment.registration.personName}
                    </td>
                    <td className="px-4 py-2 max-w-[180px] truncate" title={payment.registration.eventName}>
                      {payment.registration.eventName}
                    </td>
                    <td className="px-2 py-2">
                      <StatusBadge status={payment.status} type="status" />
                    </td>
                    <td className="px-2 py-2">
                      <StatusBadge status={payment.paymentType} type="paymentType" />
                    </td>
                    <td className="px-2 py-2">{providerTypeLabels[payment.provider] || payment.provider}</td>
                    <td className="px-2 py-2">R$ {payment.amount.toFixed(2)}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                      {new Date(payment.paymentDate).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-2 py-2 text-center">{payment.installments}</td>
                    <td className="px-2 py-2 text-center">
                        <Button
                          disabled={(payment.status !== "PENDING" && payment.status !== "INPROCESS")}
                          onClick={() => {
                            setSelectedPaymentId(payment.id);
                            setIsModalOpen(true);
                          }}
                          className={`${
                            (payment.status !== "PENDING" && payment.status !== "INPROCESS")
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-orange-400 hover:text-orange-500 cursor-pointer"
                          }`}
                        >
                          Desconto
                        </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && (
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className={`mt-4 ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            <ArrowLeftCircle className="mr-2" size={16} />
            Anterior
          </Button>

          <span className="text-white text-sm">
            Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages - 1}
            className={`mt-4 ${
              currentPage >= totalPages - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            Próxima
            <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}

      {/* Modal de cupom */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
          <DialogHeader>
            <DialogTitle>Aplicar desconto</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 space-x-2">
            <label htmlFor="coupon" className="text-sm">
              Informe o código do cupom:
            </label>
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-neutral-800 text-white border-neutral-600"
              placeholder="EXEMPLO10"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setCouponCode("");
              }}
              className="text-white border-neutral-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (selectedPaymentId && couponCode.trim()) {
                  await handleDiscount(selectedPaymentId, couponCode.trim());
                  setIsModalOpen(false);
                  setCouponCode("");
                } else {
                  toast.error("Preencha o código do cupom.");
                }
              }}
              className="text-orange-400 hover:text-orange-500 border-orange-600"
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}