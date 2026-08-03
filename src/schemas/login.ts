import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L’email est obligatoire.")
    .email("Saisissez une adresse email valide."),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire.")
    .refine((value) => value.trim().length > 0, {
      message: "Le mot de passe ne peut pas être composé uniquement d’espaces.",
    }),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
