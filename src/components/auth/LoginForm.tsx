import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import {
  loginSchema,
  type LoginFormValues,
} from "@/schemas/login";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  onGoogleLogin: () => Promise<boolean | void> | boolean | void;
  onForgotPassword: (
    email: string,
  ) => Promise<boolean | void> | boolean | void;
  isSubmitting?: boolean;
}

export function LoginForm({
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  isSubmitting = false,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormValues>,
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  return (
    <form
      id="panel-login"
      role="tabpanel"
      aria-labelledby="tab-login"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      noValidate
    >
      <Input
        id="loginEmail"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="prenom.nom@cartin.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordInput
        id="loginPass"
        label="Mot de passe"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="auth-row-between">
        <label className="auth-check">
          <input type="checkbox" {...register("remember")} />
          Se souvenir
        </label>
        <button
          type="button"
          className="auth-link"
          onClick={() => {
            void onForgotPassword(getValues("email"));
          }}
        >
          Mot de passe oublié ?
        </button>
      </div>

      <Button type="submit" loading={isSubmitting}>
        Entrer dans Cartin AI
      </Button>

      <div className="auth-divider">ou</div>

      <GoogleLoginButton
        onClick={() => {
          void onGoogleLogin();
        }}
        disabled={isSubmitting}
      />
    </form>
  );
}
