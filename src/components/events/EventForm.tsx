"use client";

import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  FileText, 
  Tag, 
  Users, 
  Clock, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Save,
  X,
  Info,
  Smile
} from "lucide-react";
import { EventFormData, eventSchema } from "@/schemas/eventSchema";
import Select from "../ui/select";
import { CustomToggle } from "../ui/customToggle";
import { CustomDateTimePicker } from "../ui/CustomDateTimePicker";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { BatchList } from "./BatchList";
import Link from "next/link";
import { OrganizerResponse } from "@/services/organizersService";
import { Card } from "@/components/ui/card";
import "../../styles/datepicker.css";

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  defaultValues?: EventFormData;
  isSubmitting?: boolean;
  organizers: OrganizerResponse[];
}

interface OrganizerOption {
  value: string;
  label: string;
}

const eventTypes = [
  { label: "Retiro", value: "RETREAT" },
  { label: "Retiro de Líderes", value: "LEADERS_RETREAT" },
  { label: "Reunião", value: "MEETING" },
  { label: "Conferência", value: "CONFERENCE" },
  { label: "Workshop", value: "WORKSHOP" },
  { label: "Seminário", value: "SEMINARY" },
  { label: "Vigília", value: "VIGIL" },
  { label: "Culto", value: "CULT" },
  { label: "Coral", value: "CORAL" },
  { label: "Concerto", value: "CONCERT" },
  { label: "Teatro", value: "THEATER" },
  { label: "Curso", value: "COURSE" },
  { label: "Evangelismo", value: "EVANGELISM" },
];

const steps = [
  { title: "Informações Básicas", icon: Info, description: "Nome, descrição e tipo do evento" },
  { title: "Datas e Capacidade", icon: Calendar, description: "Cronograma e limites do evento" },
  { title: "Lotes", icon: DollarSign, description: "Configuração de preços e lotes" },
  { title: "Opções Finais", icon: Settings, description: "Configurações adicionais" },
];

export function EventForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  organizers,
}: EventFormProps) {
  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...defaultValues,
      isPublished: defaultValues?.isPublished ?? false,
      hasTransport: defaultValues?.hasTransport ?? false,
      termIsRequired: defaultValues?.termIsRequired ?? false,
      isFree: defaultValues?.isFree ?? true,
      type: defaultValues?.type ?? "",
      organizer: defaultValues?.organizer ?? undefined,
      batches: defaultValues?.batches ?? [],
    },
    mode: "onTouched",
  });

  const organizerOptions: OrganizerOption[] = organizers.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof EventFormData)[] = [];

    if (step === 0) {
      fieldsToValidate = ["name", "description", "location", "type", "organizer"];
    } else if (step === 1) {
      fieldsToValidate = [
        "startDatetime",
        "endDatetime",
        "registrationStartDate",
        "registrationDeadline",
        "capacity",
      ];
    } else if (step === 2) {
      // Para lotes, só validar se não for gratuito
      const isFree = methods.watch("isFree");
      if (!isFree) {
        await trigger("batches");
        fieldsToValidate = ["batches"];
      }
    }

    const valid = await trigger(fieldsToValidate);
    if (valid && step < 3) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((stepInfo, index) => {
            const StepIcon = stepInfo.icon;
            return (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex items-center gap-3 ${index <= step ? 'text-orange-400' : 'text-neutral-500'}`}>
                  <div className={`p-2 rounded-full border-2 ${
                    index < step 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : index === step 
                      ? 'bg-orange-600/20 border-orange-400 text-orange-400'
                      : 'bg-transparent border-neutral-600 text-neutral-500'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{stepInfo.title}</p>
                    <p className="text-xs text-neutral-400">{stepInfo.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < step ? 'bg-orange-600' : 'bg-neutral-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] border border-neutral-700 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-700">
                {React.createElement(steps[step].icon, { className: "h-5 w-5 text-orange-400" })}
                <h2 className="text-xl font-semibold text-orange-300">
                  {steps[step].title}
                </h2>
              </div>

              {step === 0 && (
                <div className="space-y-6">
                  {/* Nome do Evento */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <Tag className="h-4 w-4" />
                      Nome do Evento *
                    </label>
                    <Input 
                      placeholder="Digite o nome do evento..."
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

                  {/* Descrição */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <Smile className="h-4 w-4" />
                      Descrição do Evento *
                    </label>
                    <Textarea
                      placeholder="📝 Descreva seu evento de forma atrativa! Use emojis para tornar mais interessante... 

🎯 Exemplo: 
✨ Prepare-se para uma experiência transformadora! 
🙏 Momento de adoração e comunhão
🎵 Louvor especial com convidados
🍽️ Coffee break incluído
📍 Local: Auditório Principal"
                      {...register("description")}
                      className="min-h-[120px] bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20"
                      rows={6}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        💡 Dica: Use emojis e quebras de linha para tornar a descrição mais atrativa
                      </p>
                      <p className="text-xs text-neutral-500">
                        {(methods.watch("description")?.length || 0)}/500 caracteres
                      </p>
                    </div>
                    {errors.description && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Local */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <MapPin className="h-4 w-4" />
                      Local do Evento *
                    </label>
                    <Input 
                      placeholder="Informe o local do evento..."
                      {...register("location")}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                    {errors.location && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Tipo de Evento */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <Tag className="h-4 w-4" />
                      Tipo de Evento *
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={eventTypes}
                          placeholder="Selecione o tipo de evento"
                          value={field.value}
                        />
                      )}
                    />
                    {errors.type && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  {/* Organizador */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <Users className="h-4 w-4" />
                      Organizador Responsável *
                    </label>
                    <Controller
                      name="organizer.id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={organizerOptions}
                          placeholder="Selecione um organizador"
                          value={
                            organizerOptions.find(
                              (option) => option.value === field?.value
                            )?.value || ""
                          }
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                    {errors.organizer && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.organizer.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Data e Hora de Início */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <Clock className="h-4 w-4" />
                        Data e Hora de Início *
                      </label>
                      <CustomDateTimePicker
                        name="startDatetime"
                        control={control}
                        placeholder="Selecione data e hora de início"
                      />
                      {errors.startDatetime && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.startDatetime.message}
                        </p>
                      )}
                    </div>

                    {/* Data e Hora de Término */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <Clock className="h-4 w-4" />
                        Data e Hora de Término *
                      </label>
                      <CustomDateTimePicker
                        name="endDatetime"
                        control={control}
                        placeholder="Selecione data e hora de término"
                      />
                      {errors.endDatetime && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.endDatetime.message}
                        </p>
                      )}
                    </div>

                    {/* Início das Inscrições */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <Calendar className="h-4 w-4" />
                        Início das Inscrições *
                      </label>
                      <CustomDatePicker
                        name="registrationStartDate"
                        control={control}
                        placeholder="Data de início das inscrições"
                        withTime={false}
                      />
                      {errors.registrationStartDate && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.registrationStartDate.message}
                        </p>
                      )}
                    </div>

                    {/* Término das Inscrições */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <Calendar className="h-4 w-4" />
                        Término das Inscrições *
                      </label>
                      <CustomDatePicker
                        name="registrationDeadline"
                        control={control}
                        placeholder="Data limite para inscrições"
                        withTime={false}
                      />
                      {errors.registrationDeadline && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.registrationDeadline.message}
                        </p>
                      )}
                    </div>

                    {/* Data Limite para Pagamento */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <DollarSign className="h-4 w-4" />
                        Limite para Pagamento
                      </label>
                      <CustomDatePicker
                        name="finalDatePayment"
                        control={control}
                        placeholder="Data limite para pagamento (opcional)"
                        withTime={false}
                      />
                      {errors.finalDatePayment && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.finalDatePayment.message}
                        </p>
                      )}
                    </div>

                    {/* Capacidade */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                        <Users className="h-4 w-4" />
                        Capacidade do Evento *
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 100"
                        min="1"
                        max="10000"
                        {...register("capacity", { 
                          valueAsNumber: true,
                          required: "Capacidade é obrigatória",
                          min: { value: 1, message: "Capacidade deve ser pelo menos 1" },
                          max: { value: 10000, message: "Capacidade não pode exceder 10.000" }
                        })}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-orange-500 focus:ring-orange-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      {errors.capacity && (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.capacity.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Evento Gratuito Toggle */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                      <DollarSign className="h-4 w-4" />
                      Configuração de Preço
                    </label>
                    <Controller
                      name="isFree"
                      control={control}
                      render={({ field }) => (
                        <CustomToggle
                          id="isFree"
                          label="Evento é gratuito?"
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Lotes - mostrar apenas se não for gratuito */}
                  {!methods.watch("isFree") && (
                    <div className="space-y-4">
                      <div className="border-t border-neutral-700 pt-4">
                        <h3 className="text-lg font-medium text-orange-300 mb-4">
                          Configuração de Lotes
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto space-y-4 border border-neutral-600 rounded-lg p-4 bg-neutral-800/50">
                          <BatchList />
                          {errors.batches && (
                            <p className="text-red-400 text-sm flex items-center gap-1">
                              <X className="h-3 w-3" />
                              {errors.batches.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informação sobre evento gratuito */}
                  {methods.watch("isFree") && (
                    <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Este evento será gratuito. Não é necessário configurar lotes de pagamento.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Transporte */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-300 mb-2">
                      <Settings className="h-4 w-4" />
                      Opções de Transporte
                    </div>
                    <Controller
                      name="hasTransport"
                      control={control}
                      render={({ field }) => (
                        <CustomToggle
                          id="hasTransport"
                          label="Fornecer transporte para o evento?"
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <p className="text-xs text-neutral-400 px-3">
                      💡 Marque esta opção se o evento incluir transporte para os participantes.
                    </p>
                  </div>

                  {/* Termo Pastoral */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-300 mb-2">
                      <FileText className="h-4 w-4" />
                      Requisitos de Inscrição
                    </div>
                    <Controller
                      name="termIsRequired"
                      control={control}
                      render={({ field }) => (
                        <CustomToggle
                          id="termIsRequired"
                          label="Exigir termo pastoral para inscrição?"
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <p className="text-xs text-neutral-400 px-3">
                      📋 Marque para exigir um termo pastoral assinado durante a inscrição.
                    </p>
                  </div>

                  {/* Publicação */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-300 mb-2">
                      <Settings className="h-4 w-4" />
                      Status de Publicação
                    </div>
                    <Controller
                      name="isPublished"
                      control={control}
                      render={({ field }) => (
                        <CustomToggle
                          id="isPublished"
                          label="Publicar evento imediatamente?"
                          checked={!!field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <div className={`text-xs px-3 transition-colors ${
                      methods.watch("isPublished") ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {methods.watch("isPublished") 
                        ? "✅ O evento ficará visível e disponível para inscrições públicas."
                        : "⏸️ O evento será salvo como rascunho e não ficará visível publicamente."
                      }
                    </div>
                  </div>
                </div>
              )}


            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 bg-transparent hover:bg-neutral-700/50 text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
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
                    Salvar Evento
                  </div>
                )}
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-neutral-400">
              * Campos obrigatórios. Todos os dados serão validados antes do salvamento.
            </p>
            <Link 
              href="/events/list" 
              className="text-orange-400 hover:text-orange-300 underline text-sm mt-2 inline-block"
            >
              Cancelar e voltar para a lista
            </Link>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
