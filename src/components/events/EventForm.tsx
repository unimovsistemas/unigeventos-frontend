"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EventFormData, eventSchema } from "@/schemas/eventSchema";
import Select from "../ui/select";
import { CustomToggle } from "../ui/customToggle";
import { CustomDateTimePicker } from "../ui/CustomDateTimePicker";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { BatchList } from "./BatchList";
import Link from "next/link";
import { OrganizerResponse } from "@/services/organizersService";

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
  "Informações Básicas",
  "Datas e Capacidade",
  "Lotes",
  "Opções Finais",
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
      fieldsToValidate = ["name", "description", "location", "type"];
    } else if (step === 1) {
      fieldsToValidate = [
        "startDatetime",
        "endDatetime",
        "registrationStartDate",
        "registrationDeadline",
        "finalDatePayment",
        "capacity",
      ];
    } else if (step === 2) {
      await trigger("batches");
      fieldsToValidate = ["batches"];
    }

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl mx-auto"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{steps[step]}</h2>
        </div>

        {step === 0 && (
          <>
            <div>
              <Input placeholder="Nome do evento" {...register("name")} />
              {errors.name && (
                <p className="text-orange-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Descrição do evento"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-orange-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Local do evento" {...register("location")} />
              {errors.location && (
                <p className="text-orange-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
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
                <p className="text-orange-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            <div>
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
                <p className="text-orange-500 text-sm">
                  {errors.organizer.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <>
              <div>
                <CustomDateTimePicker
                  name="startDatetime"
                  control={control}
                  placeholder="Data e hora de início"
                />
                {errors.startDatetime && (
                  <p className="text-orange-500 text-sm">
                    {errors.startDatetime.message}
                  </p>
                )}
              </div>

              <div>
                <CustomDateTimePicker
                  name="endDatetime"
                  control={control}
                  placeholder="Data e hora de término"
                />
                {errors.endDatetime && (
                  <p className="text-orange-500 text-sm">
                    {errors.endDatetime.message}
                  </p>
                )}
              </div>

              <div>
                <CustomDatePicker
                  name="registrationStartDate"
                  control={control}
                  placeholder="Início das inscrições"
                  withTime={false}
                />
                {errors.registrationStartDate && (
                  <p className="text-orange-500 text-sm">
                    {errors.registrationStartDate.message}
                  </p>
                )}
              </div>

              <div>
                <CustomDatePicker
                  name="registrationDeadline"
                  control={control}
                  placeholder="Término das inscrições"
                  withTime={false}
                />
                {errors.registrationDeadline && (
                  <p className="text-orange-500 text-sm">
                    {errors.registrationDeadline.message}
                  </p>
                )}
              </div>

              <div>
                <CustomDatePicker
                  name="finalDatePayment"
                  control={control}
                  placeholder="Data limite para pagamento"
                  withTime={false}
                />
                {errors.finalDatePayment && (
                  <p className="text-orange-500 text-sm">
                    {errors.finalDatePayment.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Capacidade do evento"
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity && (
                  <p className="text-orange-500 text-sm">
                    {errors.capacity.message}
                  </p>
                )}
              </div>
            </>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
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

            {!methods.watch("isFree") && (
              <div className="max-h-[400px] overflow-y-auto space-y-4 border rounded-md p-4">
                <BatchList />
                {errors.batches && (
                  <p className="text-orange-500 text-sm">
                    {errors.batches.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-4">
              <Controller
                name="hasTransport"
                control={control}
                render={({ field }) => (
                  <CustomToggle
                    id="hasTransport"
                    label="Fornecer transporte?"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="termIsRequired"
                control={control}
                render={({ field }) => (
                  <CustomToggle
                    id="termIsRequired"
                    label="Exigir termo pastoral?"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="isPublished"
                control={control}
                render={({ field }) => (
                  <CustomToggle
                    id="isPublished"
                    label="Publicar evento?"
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </>
        )}

        {/* Botões de navegação */}
        <div className="flex gap-3 justify-between pt-4">
          {step > 0 && (
            <Button
              className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              type="button"
              variant="outline"
              onClick={prevStep}
            >
              Voltar
            </Button>
          )}
          {step <= 2 && (
            <Button
              className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              type="button"
              onClick={nextStep}
            >
              Próximo
            </Button>
          )}
          {step === 3 && (
            <Button
              className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-l transition-colors duration-300"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </div>
              ) : (
                "Salvar"
              )}
            </Button>
          )}
        </div>
        <div className="flex justify-center mt-6 text-sm w-full">
          <Link href="/events" className="text-orange-500 hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
