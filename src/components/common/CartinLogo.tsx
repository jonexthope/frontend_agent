interface CartinLogoProps {
  className?: string;
  width?: number;
}

export function CartinLogo({ className, width = 124 }: CartinLogoProps) {
  return (
    <img
      className={className}
      src="/images/cartin-logo.svg"
      alt="Cartin"
      width={width}
      height="auto"
      style={{ display: "block", height: "auto" }}
    />
  );
}
