import { Outlet } from 'react-router';

import { AuthProvider } from '@/app/providers/auth-provider';

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
