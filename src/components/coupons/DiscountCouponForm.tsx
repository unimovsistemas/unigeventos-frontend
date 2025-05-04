/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import "cleave.js/dist/addons/cleave-phone.br";
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 space-y-4 max-w-3xl mx-auto"
    >
      <div>
        <Input
          placeholder="Código do Cupom (Ex: UNI10)"
          {...register("code")}
        />
        {errors.code && (
          <p className="text-orange-500 text-sm">{errors.code.message}</p>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Percentual de Desconto"
          {...register("discountPercentage", { valueAsNumber: true })}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
          %
        </span>
      </div>
      {errors.discountPercentage && (
        <p className="text-orange-500 text-sm mt-1">
          {errors.discountPercentage.message}
        </p>
      )}

      <div>
        <CustomDatePicker
          name="expirationDate"
          control={control}
          placeholder="Data de expiração do cupom"
          withTime={false}
        />
        {errors.expirationDate && (
          <p className="text-orange-500 text-sm">
            {errors.expirationDate.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </div>
        ) : (
          "Salvar"
        )}
      </Button>
      <div className="flex justify-center mt-6 text-lg w-full">
        <Link href="/coupons" className="text-orange-500 hover:underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
