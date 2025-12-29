import { Check, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PasswordRequirementsProps {
  password: string;
}

const requirements = [
  {
    key: 'length',
    label: 'At least 6 characters',
    test: (p: string) => p.length >= 6,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (p: string) => /[A-Z]/.test(p),
  },
  { key: 'digit', label: 'One digit', test: (p: string) => /\d/.test(p) },
  {
    key: 'special',
    label: 'One special character',
    test: (p: string) => /[^a-zA-Z0-9]/.test(p),
  },
];

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className="space-y-1 text-sm">
      {requirements.map(({ key, label, test }) => {
        const met = test(password);
        return (
          <li
            key={key}
            className={cn(
              'flex items-center gap-2 transition-colors',
              met
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            )}
          >
            {met ? <Check className="size-4" /> : <X className="size-4" />}
            {label}
          </li>
        );
      })}
    </ul>
  );
}
