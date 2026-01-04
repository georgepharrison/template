import {
  AlertTriangle,
  CreditCard,
  Database,
  LogOut,
  Monitor,
  Shield,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { BillingTab } from './billing-tab';
import { DangerTab } from './danger-tab';
import { DataTab } from './data-tab';
import { PreferencesTab } from './preferences-tab';
import { ProfileHeaderCard } from './profile-header-card';
import { ProfileTab } from './profile-tab';
import { type SecurityContentProps } from './security-content';
import { SecurityTab } from './security-tab';

type SettingsTab =
  | 'profile'
  | 'security'
  | 'preferences'
  | 'billing'
  | 'data'
  | 'danger';

interface DesktopLayoutProps {
  email?: string;
  picture?: string;
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  securityProps: SecurityContentProps;
  onLogout: () => void;
}

const tabs: {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
}[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Monitor },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
];

export function DesktopLayout({
  email,
  picture,
  theme,
  setTheme,
  securityProps,
  onLogout,
}: DesktopLayoutProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="mx-auto hidden max-w-4xl md:block">
      {/* Profile Header Card */}
      <ProfileHeaderCard
        email={email}
        picture={picture}
        isTwoFactorEnabled={securityProps.twoFactorData?.isTwoFactorEnabled}
        onEditClick={() => setActiveTab('profile')}
      />

      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-muted text-foreground'
                    : tab.danger
                      ? 'text-destructive hover:bg-destructive/10'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="mt-8 border-t pt-8">
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-3"
              onClick={onLogout}
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {activeTab === 'profile' && <ProfileTab email={email} />}
          {activeTab === 'security' && (
            <SecurityTab securityProps={securityProps} />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab theme={theme} setTheme={setTheme} />
          )}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'danger' && <DangerTab />}
        </div>
      </div>
    </div>
  );
}
