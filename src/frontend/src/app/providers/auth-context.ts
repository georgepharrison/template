import { createContext } from 'react';

import type { InfoResponse } from '@/api/auth.gen';

export type AuthState = {
  user: InfoResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
