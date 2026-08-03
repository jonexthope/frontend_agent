import { z } from "zod";
import { ACCESS_ROLES } from "@/configs/auth.config";

export const accessRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L’email professionnel est obligatoire.")
    .email("Saisissez une adresse email valide."),
  role: z
    .string()
    .min(1, "Le rôle est obligatoire.")
    .refine((value) => (ACCESS_ROLES as readonly string[]).includes(value), {
      message: "Sélectionnez un rôle valide.",
    }),
  message: z
    .string()
    .min(1, "Le message est obligatoire.")
    .refine((value) => value.trim().length > 0, {
      message: "Le message ne peut pas être composé uniquement d’espaces.",
    }),
});

export type AccessRequestFormValues = z.infer<typeof accessRequestSchema>;
