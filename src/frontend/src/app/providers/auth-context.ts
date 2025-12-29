import { createContext } from 'react';

import type { UserInfoResponse } from '@/api/auth.gen';

export type AuthState = {
  user: UserInfoResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
