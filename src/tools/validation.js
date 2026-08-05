import { z } from "zod";
import { ACCESS_ROLES } from "@/configs/auth.constants";

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

export const accessRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L’email professionnel est obligatoire.")
    .email("Saisissez une adresse email valide."),
  role: z
    .string()
    .min(1, "Le rôle est obligatoire.")
    .refine((value) => ACCESS_ROLES.includes(value), {
      message: "Sélectionnez un rôle valide.",
    }),
  message: z
    .string()
    .min(1, "Le message est obligatoire.")
    .refine((value) => value.trim().length > 0, {
      message: "Le message ne peut pas être composé uniquement d’espaces.",
    }),
});

export function validateLogin(values) {
  const result = loginSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data, errors: {} };
  const errors = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  });
  return { success: false, data: null, errors };
}

export function validateAccessRequest(values) {
  const result = accessRequestSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data, errors: {} };
  const errors = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  });
  return { success: false, data: null, errors };
}
