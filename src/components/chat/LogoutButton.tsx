import { IconButton } from "@/components/common/IconButton";

interface LogoutButtonProps {
  onClick: () => void;
}

export function LogoutButton({ onClick }: LogoutButtonProps) {
  return (
    <IconButton onClick={onClick} title="Déconnexion non disponible">
      <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden>
        <path
          d="M6 3H3.5A1.5 1.5 0 002 4.5v7A1.5 1.5 0 003.5 13H6M10.5 11.5L14 8l-3.5-3.5M14 8H6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
}
