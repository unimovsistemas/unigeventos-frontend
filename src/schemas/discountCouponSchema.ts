import { z } from "zod";

export const discountCouponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Código do cupom é obrigatório"),
  discountPercentage: z.coerce
  .number({
    required_error: "O percentual de desconto é obrigatório.",
    invalid_type_error: "O percentual de desconto deve ser um número.",
  })
  .min(1, "O percentual de desconto deve ser maior que 0."),
  expirationDate: z.date({ required_error: "A data de início é obrigatória." }),
});

export type DiscountCouponFormData = z.infer<typeof discountCouponSchema>;