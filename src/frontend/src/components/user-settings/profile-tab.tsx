import { Check, Upload, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AppleIcon, GoogleIcon, MailIcon } from './icons';
import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

interface ProfileTabProps {
  email?: string;
}

export function ProfileTab({ email }: ProfileTabProps) {
  const displayName = email?.split('@')[0] ?? 'User';

  return (
    <div className="space-y-6">
      <SettingsGroup title="Account Information">
        <SettingsRow icon={User} label="Display Name" value={displayName} />
        <SettingsRow
          icon={MailIcon}
          label="Email"
          value={email ?? ''}
          chevron={false}
        />
      </SettingsGroup>

      <SettingsGroup title="Profile Picture">
        <div className="p-4">
          <p className="text-muted-foreground mb-3 text-sm">
            Choose your profile picture source
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/50 bg-primary/10 text-primary gap-2"
            >
              <GoogleIcon className="size-4" /> Google{' '}
              <Check className="size-3" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <AppleIcon className="size-4" /> Apple
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="size-4" /> Upload
            </Button>
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
}
