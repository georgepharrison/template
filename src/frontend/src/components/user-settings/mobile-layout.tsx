import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  ChevronRight,
  Download,
  LogOut,
  Monitor,
  Moon,
  Shield,
  Sun,
  Trash2,
  Upload,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { AppleIcon, GoogleIcon, MailIcon } from './icons';
import { SecurityContent, type SecurityContentProps } from './security-content';
import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

interface MobileLayoutProps {
  email?: string;
  picture?: string;
  isEmailConfirmed?: boolean;
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  securityProps: SecurityContentProps;
  onLogout: () => void;
}

export function MobileLayout({
  email,
  picture,
  isEmailConfirmed,
  theme,
  setTheme,
  securityProps,
  onLogout,
}: MobileLayoutProps) {
  const initials = email ? email.substring(0, 2).toUpperCase() : '??';

  return (
    <div className="mx-auto max-w-lg md:hidden">
      {/* Profile Header */}
      <div className="mb-10 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="size-24 text-2xl">
            <AvatarImage src={picture ?? ''} alt={email ?? ''} />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button className="bg-primary hover:bg-primary/90 absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full shadow-lg transition-colors">
            <Camera className="text-primary-foreground size-4" />
          </button>
        </div>
        <h2 className="text-xl font-semibold">{email ?? 'User'}</h2>
        <p className="text-muted-foreground text-sm">
          {isEmailConfirmed ? 'Verified Account' : 'Unverified Account'}
        </p>
      </div>

      {/* Account */}
      <SettingsGroup title="Account">
        <SettingsRow icon={User} label="Edit Profile" />
        <SettingsRow
          icon={MailIcon}
          label="Email"
          value={email ?? ''}
          chevron={false}
        />
        <div className="p-4">
          <p className="text-muted-foreground mb-3 text-xs">
            Profile Picture Source
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-primary/50 bg-primary/10 text-primary flex-1 gap-2"
            >
              <GoogleIcon className="size-4" /> Google{' '}
              <Check className="size-3" />
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <AppleIcon className="size-4" /> Apple
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Upload className="size-4" /> Upload
            </Button>
          </div>
        </div>
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Security">
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                className="hover:bg-muted/80 flex w-full items-center justify-between p-4 transition-colors"
              />
            }
          >
            <div className="flex items-center gap-3">
              <div className="bg-background flex size-8 items-center justify-center rounded-lg">
                <Shield className="text-muted-foreground size-4" />
              </div>
              <span className="text-sm">Two-Factor Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  securityProps.twoFactorData?.isTwoFactorEnabled
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {securityProps.isLoading2FA
                  ? '...'
                  : securityProps.twoFactorData?.isTwoFactorEnabled
                    ? 'On'
                    : 'Off'}
              </span>
              <ChevronRight className="text-muted-foreground/50 size-4" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Security Settings</DialogTitle>
              <DialogDescription>
                Manage your account security
              </DialogDescription>
            </DialogHeader>
            <SecurityContent {...securityProps} />
          </DialogContent>
        </Dialog>
        <SettingsRow icon={Monitor} label="Active Sessions" value="1 device" />
      </SettingsGroup>

      {/* Preferences */}
      <SettingsGroup title="Preferences">
        <div className="p-4">
          <p className="mb-3 text-sm font-medium">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'Auto', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as 'light' | 'dark' | 'system')}
                className={`flex flex-col items-center gap-2 rounded-xl py-3 text-sm font-medium transition-all ${
                  theme === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <t.icon className="size-5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <SettingsRow icon={Bell} label="Notifications" />
      </SettingsGroup>

      {/* Subscription */}
      <SettingsGroup title="Subscription">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-muted-foreground text-xs">
                Upgrade for more features
              </p>
            </div>
            <span className="text-lg font-bold">
              $0<span className="text-muted-foreground text-xs">/mo</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Upgrade</Button>
            <Button variant="outline" className="flex-1">
              Manage
            </Button>
          </div>
        </div>
      </SettingsGroup>

      {/* Data */}
      <SettingsGroup title="Data">
        <SettingsRow icon={Download} label="Export My Data" />
      </SettingsGroup>

      {/* Danger Zone */}
      <SettingsGroup title="Danger Zone" variant="danger">
        <SettingsRow icon={Trash2} label="Delete Personal Data" danger />
        <SettingsRow icon={AlertTriangle} label="Delete Account" danger />
      </SettingsGroup>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive mb-8 w-full gap-2"
        onClick={onLogout}
      >
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  );
}
