import { Calendar, Mail, Pencil, Shield, ShieldCheck } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderCardProps {
  email?: string;
  picture?: string | null;
  joinDate?: string;
  isTwoFactorEnabled?: boolean;
  onEditClick?: () => void;
}

export function ProfileHeaderCard({
  email,
  picture,
  joinDate = 'March 2023',
  isTwoFactorEnabled,
  onEditClick,
}: ProfileHeaderCardProps) {
  const initials = email ? email.substring(0, 2).toUpperCase() : '??';
  const displayName = email?.split('@')[0] ?? 'User';

  return (
    <div className="group bg-muted/50 relative mb-6 overflow-hidden rounded-2xl p-6">
      {/* Edit button - appears on hover */}
      {onEditClick && (
        <button
          onClick={onEditClick}
          className="bg-background hover:bg-muted absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          aria-label="Edit profile"
        >
          <Pencil className="text-muted-foreground size-4" />
        </button>
      )}

      <div className="flex items-center gap-6">
        <Avatar className="ring-background size-20 text-xl ring-4">
          <AvatarImage src={picture ?? ''} alt={email ?? ''} />
          <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <h2 className="text-2xl font-bold">{displayName}</h2>

          <div className="text-muted-foreground space-y-0.5">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Optional: Security status badge */}
        <div className="hidden sm:block">
          {isTwoFactorEnabled !== undefined && (
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                isTwoFactorEnabled
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {isTwoFactorEnabled ? (
                <>
                  <ShieldCheck className="size-3.5" />
                  <span>2FA Enabled</span>
                </>
              ) : (
                <>
                  <Shield className="size-3.5" />
                  <span>2FA Disabled</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
