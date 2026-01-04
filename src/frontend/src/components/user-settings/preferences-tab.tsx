import { Bell, Monitor, Moon, Sun } from 'lucide-react';

import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

interface PreferencesTabProps {
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export function PreferencesTab({ theme, setTheme }: PreferencesTabProps) {
  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'Auto', icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      <SettingsGroup title="Appearance">
        <div className="p-4">
          <p className="mb-3 text-sm font-medium">Theme</p>
          <div className="grid max-w-xs grid-cols-3 gap-2">
            {themeOptions.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
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
      </SettingsGroup>

      <SettingsGroup title="Notifications">
        <SettingsRow icon={Bell} label="Email Notifications" />
        <SettingsRow icon={Bell} label="Push Notifications" />
      </SettingsGroup>
    </div>
  );
}
