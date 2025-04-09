import { z } from "zod";

export const organizerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  contact: z.object({
    email: z.string().email("Email inválido"),
    phoneNumber: z.string().min(1, "Telefone é obrigatório"),
  }),
  additionalDetails: z.string().optional(),
});

export type OrganizerFormData = z.infer<typeof organizerSchema>;
