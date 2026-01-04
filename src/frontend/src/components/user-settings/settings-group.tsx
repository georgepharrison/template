interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

export function SettingsGroup({
  title,
  children,
  variant = 'default',
}: SettingsGroupProps) {
  const isDanger = variant === 'danger';

  return (
    <div className="mb-6">
      <p
        className={`mb-3 px-1 text-xs font-semibold tracking-wider uppercase ${
          isDanger ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {title}
      </p>
      <div
        className={`divide-y overflow-hidden rounded-2xl ${
          isDanger
            ? 'divide-destructive/20 border-destructive/20 bg-destructive/5 border'
            : 'divide-border bg-muted/50'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
