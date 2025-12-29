import { createBrowserRouter } from 'react-router';

import { ProtectedRoute } from '@/components/protected-route';

import { AppLayout } from './app-layout';
import { AuthLayout } from './auth-layout';
import { RootLayout } from './root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            lazy: () =>
              import('@/pages/login').then((m) => ({
                Component: m.LoginPage,
              })),
          },
          {
            path: 'signup',
            lazy: () =>
              import('@/pages/signup').then((m) => ({
                Component: m.SignupPage,
              })),
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                lazy: () =>
                  import('@/pages/home').then((m) => ({
                    Component: m.HomePage,
                  })),
              },
            ],
          },
        ],
      },
    ],
  },
]);
