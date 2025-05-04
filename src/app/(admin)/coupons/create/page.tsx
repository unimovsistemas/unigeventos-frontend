/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { createDiscountCoupon } from "@/services/couponsService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateDiscountCouponPage() {
  const router = useRouter();
  
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  
  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      if (!token) return;

      await createDiscountCoupon(token, data);
      toast.success("Cupom de desconto criado com sucesso!");
      router.push("/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao cadastrar o cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-orange-400">Novo Cupom de Desconto</h1>
      <DiscountCouponForm onSubmit={handleSubmit} />
    </div>
  );
}