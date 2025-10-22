/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DiscountCouponForm } from "@/components/coupons/DiscountCouponForm";
import { DiscountCouponFormData } from "@/schemas/discountCouponSchema";
import { createDiscountCoupon } from "@/services/couponsService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Tag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function CreateDiscountCouponPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: DiscountCouponFormData) => {
    try {
      setIsSubmitting(true);

      await createDiscountCoupon(data);
      toast.success("Cupom de desconto criado com sucesso!");
      router.push("/admin/coupons/list");
    } catch (err: any) {
      toast.error(`Erro ao cadastrar o cupom de desconto. Causa: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/coupons/list">
            <Button className="bg-neutral-800 hover:bg-neutral-700 text-orange-400 border border-neutral-600 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Tag className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-400">Novo Cupom de Desconto</h1>
              <p className="text-neutral-400 text-sm">
                Cadastre um novo cupom promocional
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
            
            <DiscountCouponForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-neutral-400">
          <p>
            Todos os campos marcados com * são obrigatórios.{" "}
            <Link 
              href="/admin/coupons/list" 
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