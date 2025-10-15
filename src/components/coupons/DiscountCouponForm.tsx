/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2, Tag, Percent, Calendar, Save, X } from "lucide-react";
import Link from "next/link";
import {
  DiscountCouponFormData,
  discountCouponSchema,
} from "@/schemas/discountCouponSchema";
import { CustomDatePicker } from "../ui/CustomDatePicker";

interface DiscountCouponFormProps {
  onSubmit: (data: DiscountCouponFormData) => void;
  defaultValues?: DiscountCouponFormData;
  isSubmitting?: boolean;
}

export function DiscountCouponForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: DiscountCouponFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<DiscountCouponFormData>({
    resolver: zodResolver(discountCouponSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Código do Cupom */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <Tag className="h-4 w-4 text-orange-400" />
          Código do Cupom *
        </label>
        <Input
          placeholder="Ex: DESCONTO10, PROMO2025"
          {...register("code")}
          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 uppercase"
          style={{ textTransform: 'uppercase' }}
        />
        {errors.code && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="text-red-400">⚠</span> {errors.code.message}
          </p>
        )}
        <p className="text-xs text-neutral-400">
          Use apenas letras maiúsculas e números, sem espaços
        </p>
      </div>

      {/* Percentual de Desconto */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <Percent className="h-4 w-4 text-orange-400" />
          Percentual de Desconto *
        </label>
        <div className="relative">
          <Input
            type="number"
            placeholder="Ex: 10, 15, 20"
            {...register("discountPercentage", { valueAsNumber: true })}
            className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 pr-12"
            min="1"
            max="100"
            step="1"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg font-semibold pointer-events-none">
            %
          </span>
        </div>
        {errors.discountPercentage && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="text-red-400">⚠</span> {errors.discountPercentage.message}
          </p>
        )}
        <p className="text-xs text-neutral-400">
          Digite um valor entre 1% e 100%
        </p>
      </div>

      {/* Data de Expiração */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <Calendar className="h-4 w-4 text-orange-400" />
          Data de Expiração *
        </label>
        <CustomDatePicker
          name="expirationDate"
          control={control}
          placeholder="Selecione a data de expiração"
          withTime={false}
        />
        {errors.expirationDate && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="text-red-400">⚠</span> {errors.expirationDate.message}
          </p>
        )}
        <p className="text-xs text-neutral-400">
          O cupom ficará ativo até a data selecionada
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-700">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 rounded-lg text-white font-medium bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Cupom
            </div>
          )}
        </Button>
        <Link href="/coupons/list" className="flex-1">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg font-medium bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-200"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
