// src/frontend/src/components/theme-toggle.tsx
import { type VariantProps } from 'class-variance-authority';
import { useId } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

import './theme-toggle.css';

const iconSizeMap = {
  default: 'size-5',
  xs: 'size-3',
  sm: 'size-4',
  lg: 'size-6',
  icon: 'size-5',
  'icon-xs': 'size-3',
  'icon-sm': 'size-4',
  'icon-lg': 'size-6',
} as const;

interface ThemeToggleProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export function ThemeToggle({
  className,
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const maskId = useId();
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    setTheme(isDark ? 'light' : 'dark', event);
  }

  const iconSize = iconSizeMap[size ?? 'default'];

  return (
    <Button
      onClick={toggleTheme}
      variant={variant}
      size={size}
      className={className}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <svg
        className={`sun-and-moon ${iconSize} ${isDark ? 'dark' : ''}`}
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <mask className="moon" id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle
          className="sun"
          cx="12"
          cy="12"
          r="6"
          mask={`url(#${maskId})`}
          fill="currentColor"
        />
        <g className="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </Button>
  );
}
