import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useGetApiAuthManageInfo } from '@/api/auth.gen';

import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useGetApiAuthManageInfo({
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });

  const isAuthenticated = !!user && !error;

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    queryClient.clear();
    navigate('/login');
  }, [queryClient, navigate]);

  return (
    <AuthContext
      value={{ user: user ?? null, isLoading, isAuthenticated, logout }}
    >
      {children}
    </AuthContext>
  );
}
