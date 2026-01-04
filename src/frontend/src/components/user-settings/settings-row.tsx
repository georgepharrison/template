import { ChevronRight } from 'lucide-react';

interface SettingsRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'pro';
  danger?: boolean;
  chevron?: boolean;
  onClick?: () => void;
}

export function SettingsRow({
  icon: Icon,
  label,
  value,
  badge,
  badgeVariant = 'default',
  danger = false,
  chevron = true,
  onClick,
}: SettingsRowProps) {
  return (
    <button
      className={`hover:bg-muted/80 flex w-full items-center justify-between p-4 transition-colors ${
        danger ? 'text-destructive' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${
            danger ? 'bg-destructive/10' : 'bg-background'
          }`}
        >
          <Icon
            className={`size-4 ${danger ? 'text-destructive' : 'text-muted-foreground'}`}
          />
        </div>
        <span className={`text-sm ${danger ? 'text-destructive' : ''}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              badgeVariant === 'success'
                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                : badgeVariant === 'pro'
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {badge}
          </span>
        )}
        {value && (
          <span className="text-muted-foreground text-sm">{value}</span>
        )}
        {chevron && (
          <ChevronRight className="text-muted-foreground/50 size-4" />
        )}
      </div>
    </button>
  );
}
