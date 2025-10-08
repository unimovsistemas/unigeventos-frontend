import { z } from "zod";

// Phone number validation regex for Brazilian format
const phoneRegex = /^\(\d{2}\)\s\d{1}\s\d{4}-\d{4}$/;

export const organizerSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  contact: z.object({
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Formato de email inválido")
      .max(255, "Email deve ter no máximo 255 caracteres"),
    phoneNumber: z
      .string()
      .min(1, "Telefone é obrigatório")
      .refine(
        (phone) => phoneRegex.test(phone),
        "Formato de telefone inválido. Use: (11) 9 9999-9999"
      ),
  }),
  additionalDetails: z
    .string()
    .max(500, "Detalhes devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type OrganizerFormData = z.infer<typeof organizerSchema>;
