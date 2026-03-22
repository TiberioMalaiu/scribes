import React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarUser {
  name?: string;
  avatarUrl?: string | null;
  status?: string;
}

interface AvatarProps {
  user?: AvatarUser | null;
  size?: AvatarSize;
  showStatus?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-14 h-14 text-lg',
};

export default function Avatar({ user, size, showStatus }: AvatarProps) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div className="relative inline-flex">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name || 'User'}
          className={`${sizeClasses[size || 'md']} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div className={`${sizeClasses[size || 'md']} rounded-full bg-brand-500 text-white flex items-center justify-center font-medium ring-2 ring-white`}>
          {initials}
        </div>
      )}
      {showStatus && user?.status && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
          user.status === 'online' ? 'bg-green-400' :
          user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-300'
        }`} />
      )}
    </div>
  );
}
