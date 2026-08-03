import type { FieldErrors, FieldValues } from "react-hook-form";

export function firstFieldError<T extends FieldValues>(
  errors: FieldErrors<T>,
): string | null {
  const values = Object.values(errors);
  for (const error of values) {
    if (!error) continue;
    if (typeof error === "object" && "message" in error && error.message) {
      return String(error.message);
    }
  }
  return null;
}
