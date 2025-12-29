import { use } from 'react';

import {
  ThemeProviderContext,
  type ThemeProviderState,
} from '@/app/providers/theme-context';

export function useTheme(): ThemeProviderState {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}
