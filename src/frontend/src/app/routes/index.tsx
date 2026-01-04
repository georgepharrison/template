import { createBrowserRouter } from 'react-router';

import { ProtectedRoute } from '@/components/protected-route';
import { FullPageSpinner } from '@/components/ui/spinner';

import { AppLayout } from './app-layout';
import { AuthLayout } from './auth-layout';
import { RootLayout } from './root';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      hydrateFallbackElement: <FullPageSpinner />,
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
            {
              path: 'confirm-email',
              lazy: () =>
                import('@/pages/confirm-email').then((m) => ({
                  Component: m.ConfirmEmailPage,
                })),
            },
            {
              path: 'forgot-password',
              lazy: () =>
                import('@/pages/forgot-password').then((m) => ({
                  Component: m.ForgotPasswordPage,
                })),
            },
            {
              path: 'reset-password',
              lazy: () =>
                import('@/pages/reset-password').then((m) => ({
                  Component: m.ResetPasswordPage,
                })),
            },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <AppLayout />,
              handle: { breadcrumb: 'Home' },
              children: [
                {
                  index: true,
                  lazy: () =>
                    import('@/pages/home').then((m) => ({
                      Component: m.HomePage,
                    })),
                },
                {
                  path: 'user-settings',
                  handle: { breadcrumb: 'Settings' },
                  lazy: () =>
                    import('@/pages/user-settings').then((m) => ({
                      Component: m.UserSettingsPage,
                    })),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
