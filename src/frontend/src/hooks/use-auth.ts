import { use } from 'react';

import { AuthContext, type AuthState } from '@/app/providers/auth-context';

export function useAuth(): AuthState {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
