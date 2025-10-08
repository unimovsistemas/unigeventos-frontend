/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizerSchema, OrganizerFormData } from "@/schemas/organizerSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Loader2, User, Mail, Phone, FileText, Save, X } from "lucide-react";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
          <User className="h-4 w-4" />
          Nome do Organizador *
        </label>
        <Input 
          placeholder="Digite o nome do organizador..."
          {...register("name")}
          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20"
        />
        {errors.name && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <X className="h-3 w-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
          <Mail className="h-4 w-4" />
          Email de Contato *
        </label>
        <Input
          type="email"
          placeholder="exemplo@email.com"
          {...register("contact.email")}
          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20"
        />
        {errors.contact?.email && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <X className="h-3 w-3" />
            {errors.contact.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
          <Phone className="h-4 w-4" />
          Telefone de Contato *
        </label>
        <Controller
          name="contact.phoneNumber"
          control={control}
          render={({ field }) => (
            <Cleave
              {...field}
              placeholder="(11) 9 9999-9999"
              options={{
                delimiters: ["(", ") ", " ", "-"],
                blocks: [0, 2, 1, 4, 4],
                numericOnly: true,
              }}
              className="flex h-10 w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        />
        {errors.contact?.phoneNumber && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <X className="h-3 w-3" />
            {errors.contact.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Additional Details Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
          <FileText className="h-4 w-4" />
          Detalhes Adicionais
        </label>
        <Textarea
          placeholder="Informações complementares sobre o organizador (opcional)..."
          {...register("additionalDetails")}
          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20 min-h-[100px] resize-none"
        />
        {errors.additionalDetails && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <X className="h-3 w-3" />
            {errors.additionalDetails.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              {defaultValues ? "Atualizar Organizador" : "Criar Organizador"}
            </div>
          )}
        </Button>
        
        <Link href="/organizers/list" className="flex-1">
          <Button
            type="button"
            disabled={isSubmitting}
            className="w-full bg-transparent hover:bg-neutral-700/50 text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
      </div>

      {/* Help Text */}
      <div className="text-center pt-4">
        <p className="text-xs text-neutral-400">
          * Campos obrigatórios. Todos os dados serão validados antes do salvamento.
        </p>
      </div>
    </form>
  );
}
