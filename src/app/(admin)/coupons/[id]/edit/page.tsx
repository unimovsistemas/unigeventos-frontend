/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { ArrowLeft, Tag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { getCouponById, updateDiscountCoupon } from "@/services/couponsService";
import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";

export default function EditDiscountCouponPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [coupon, setCoupon] = useState<DiscountCouponFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  useEffect(() => {
    if (token && id) {
      setIsLoading(true);
      getCouponById(token, id)
        .then(setCoupon)
        .catch((err: any) => {
          toast.error(`Erro ao carregar cupom de desconto: ${err.message}`);
          router.push("/coupons/list");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, token, router]);

  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      setIsSubmitting(true);
      if (!token) return;

      await updateDiscountCoupon(token, id!, data);
      toast.success("Cupom de Desconto atualizado com sucesso!");
      router.push("/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao atualizar cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Carregando cupom..." />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Cupom não encontrado</p>
          <Link href="/coupons/list">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Voltar para a lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/coupons/list">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Tag className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Editar Cupom de Desconto</h1>
              <p className="text-neutral-400 text-sm">
                Atualize as informações do cupom promocional
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-700">
              <Ticket className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-orange-300">
                Informações do Cupom
              </h2>
            </div>
            
            <DiscountCouponForm 
              onSubmit={handleSubmit} 
              defaultValues={coupon}
              isSubmitting={isSubmitting}
            />
          </div>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-400">
          <p>
            Todos os campos marcados com * são obrigatórios.{" "}
            <Link 
              href="/coupons/list" 
              className="text-orange-400 hover:text-orange-300 underline"
            >
              Voltar para a lista
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
