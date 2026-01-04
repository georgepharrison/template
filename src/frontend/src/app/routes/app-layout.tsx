import type React from 'react';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { PWAUpdatePrompt } from '@/components/pwa-update-prompt';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout() {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
          <main
            className="flex-1 p-4"
            style={{ viewTransitionName: 'main-content' }}
          >
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-lg animate-pulse space-y-4">
      <div className="bg-muted h-8 w-48 rounded" />
      <div className="bg-muted h-32 rounded" />
      <div className="bg-muted h-32 rounded" />
    </div>
  );
}
