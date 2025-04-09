/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizerSchema, OrganizerFormData } from "@/schemas/organizerSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.br";
import Link from "next/link";

interface OrganizerFormProps {
  onSubmit: (data: OrganizerFormData) => void;
  defaultValues?: OrganizerFormData;
  isSubmitting?: boolean;
}

export function OrganizerForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: OrganizerFormProps) {
  const {
    register,
    handleSubmit,
    control, // ✅ Adicione isso aqui!
    formState: { errors },
    reset,
  } = useForm<OrganizerFormData>({
    resolver: zodResolver(organizerSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Nome" {...register("name")} />
        {errors.name && (
          <p className="text-orange-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register("contact.email")}
        />
        {errors.contact?.email && (
          <p className="text-orange-500 text-sm">
            {errors.contact.email.message}
          </p>
        )}
      </div>

      <div>
        <Controller
          name="contact.phoneNumber"
          control={control}
          render={({ field }) => (
            <Cleave
              {...field}
              placeholder="Telefone"
              options={{
                delimiters: ["(", ") ", " ", "-"],
                blocks: [0, 2, 1, 4, 4],
                numericOnly: true,
              }}
              className="text-orange-500 border border-input bg-background px-3 py-2 rounded-md w-full"
            />
          )}
        />
      </div>

      <div>
        <Textarea
          className="text-orange-500 text-sm"
          placeholder="Detalhes adicionais"
          {...register("additionalDetails")}
        />
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
        <Link href="/organizers" className="text-orange-500 hover:underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
