interface LoaderProps {
  dark?: boolean;
  label?: string;
}

export function Loader({ dark = false, label = "Chargement" }: LoaderProps) {
  return (
    <span
      className={`auth-loader${dark ? " auth-loader--dark" : ""}`}
      role="status"
      aria-label={label}
    />
  );
}
