import { z } from "zod";

const batchSchema = z.object({
  id: z.string().optional(), // ID é opcional para criação
  name: z.string().min(1, "Nome do lote é obrigatório"),
  capacity: z
    .number({ invalid_type_error: "Capacidade do lote é obrigatório" })
    .min(1, "Capacidade deve ser pelo menos 1"),
  price: z
    .number({ invalid_type_error: "Preço do lote é obrigatório" })
    .min(0, "Preço do lote não pode ser negativo"),
  startDate: z.date({ invalid_type_error: "Data de início do lote é obrigatória" }),
  endDate: z.date({ invalid_type_error: "Data de fim do lote é obrigatória" }),
});

const organizer = z.object({
  id: z.string(),
})

export const eventSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().optional(),
  location: z.string().min(1, "A localização é obrigatória."),
  type: z.enum(
    [
      "",
      "RETREAT",
      "LEADERS_RETREAT",
      "MEETING",
      "CONFERENCE",
      "WORKSHOP",
      "SEMINARY",
      "VIGIL",
      "CULT",
      "CORAL",
      "CONCERT",
      "THEATER",
      "COURSE",
      "EVANGELISM",
    ],
    {
      required_error: "O tipo é obrigatório.",
    }
  ),
  startDatetime: z.date({ required_error: "A data de início é obrigatória." }),
  endDatetime: z.date({ required_error: "A data de término é obrigatória." }),
  registrationStartDate: z
    .date({required_error: "Data de início das inscrições é obrigatória."}),
  registrationDeadline: z
    .date({ required_error: "Data de encerramento das inscrições é obrigatória."}),
  finalDatePayment: z
    .date().optional(),
  capacity: z.coerce
    .number({
      required_error: "A capacidade é obrigatória.",
      invalid_type_error: "A capacidade deve ser um número.",
    })
    .min(1, "Capacidade deve ser no mínimo 1."),
  isPublished: z.boolean(),
  hasTransport: z.boolean(),
  termIsRequired: z.boolean(),
  isFree: z.boolean(),
  organizer: organizer,
  batches: z.array(batchSchema).optional(),
}).superRefine((data, ctx) => {
  if (!data.isFree && data.batches?.length === 0) {
    ctx.addIssue({
      path: ["batches"],
      code: z.ZodIssueCode.custom,
      message: "Adicione pelo menos 1 lote para eventos pagos.",
    });
  }
});

export type EventFormData = z.infer<typeof eventSchema>;