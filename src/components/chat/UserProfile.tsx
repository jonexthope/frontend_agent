import { CHAT_USER_MOCK } from "@/mocks/user.mock";
import { UserAvatar } from "@/components/chat/UserAvatar";
import { LogoutButton } from "@/components/chat/LogoutButton";

interface UserProfileProps {
  onLogout: () => void;
}

export function UserProfile({ onLogout }: UserProfileProps) {
  return (
    <div className="chat-side-foot">
      <div className="chat-user-chip">
        <UserAvatar initials={CHAT_USER_MOCK.initials} />
        <div className="chat-user-meta">
          <strong>{CHAT_USER_MOCK.displayName}</strong>
          <small>{CHAT_USER_MOCK.email || "Auth non connectée"}</small>
        </div>
        <LogoutButton onClick={onLogout} />
      </div>
    </div>
  );
}
