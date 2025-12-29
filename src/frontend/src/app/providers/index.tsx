import type { ReactNode } from 'react';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
