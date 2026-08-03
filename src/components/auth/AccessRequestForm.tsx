import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/common/Button";
import { ACCESS_ROLES } from "@/configs/auth.config";
import {
  accessRequestSchema,
  type AccessRequestFormValues,
} from "@/schemas/access_request";

interface AccessRequestFormProps {
  onSubmit: (values: AccessRequestFormValues) => Promise<boolean> | boolean;
  isSubmitting?: boolean;
}

const ROLE_OPTIONS = ACCESS_ROLES.map((role) => ({
  value: role,
  label: role,
}));

export function AccessRequestForm({
  onSubmit,
  isSubmitting = false,
}: AccessRequestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccessRequestFormValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      email: "",
      role: "",
      message: "",
    },
  });

  return (
    <form
      id="panel-access"
      role="tabpanel"
      aria-labelledby="tab-access"
      onSubmit={handleSubmit(async (values) => {
        const ok = await onSubmit(values);
        if (ok) reset();
      })}
      noValidate
    >
      <Input
        id="accEmail"
        label="Email professionnel"
        type="email"
        autoComplete="email"
        placeholder="prenom.nom@entreprise.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Select
        id="accRole"
        label="Rôle souhaité"
        options={ROLE_OPTIONS}
        error={errors.role?.message}
        {...register("role")}
      />

      <Textarea
        id="accMsg"
        label="Message aux administrateurs"
        placeholder="Pourquoi avez-vous besoin de Cartin AI ? (équipe, cas d’usage…)"
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" loading={isSubmitting}>
        Envoyer la demande
      </Button>

      <p className="auth-access-note">
        Un administrateur validera votre accès. Vous recevrez un email une fois
        approuvé.
      </p>
    </form>
  );
}
