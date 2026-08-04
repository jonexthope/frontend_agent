interface UserAvatarProps {
  initials: string;
}

export function UserAvatar({ initials }: UserAvatarProps) {
  return <div className="chat-user-av">{initials}</div>;
}
