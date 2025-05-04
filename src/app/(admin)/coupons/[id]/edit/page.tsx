/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { getCouponById, updateDiscountCoupon } from "@/services/couponsService";
import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";

export default function EditDiscountCouponPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [coupons, setCoupons] = useState<DiscountCouponFormData | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  useEffect(() => {
    if (token && id) {
      getCouponById(token, id)
        .then(setCoupons)
        .catch((err: any) => toast.error(`Erro ao carregar cupom de desconto para edição ${err.message}`));
    }
  }, [id, token]);

  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      if (!token) return;

      await updateDiscountCoupon(token, id!, data);
      toast.success("Cupom de Desconto atualizado com sucesso!");
      router.push("/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao atualizar cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    }
  };

  if (!coupons) return <p className="text-white">Carregando...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold text-orange-400">Editar Organizador</h1>
      <DiscountCouponForm onSubmit={handleSubmit} defaultValues={coupons} />
    </div>
  );
}
