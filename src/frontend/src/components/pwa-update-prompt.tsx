import { useRegisterSW } from 'virtual:pwa-register/react';

import { Button } from '@/components/ui/button';

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('SW registered:', registration);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="bg-card fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md rounded-lg border p-4 shadow-lg">
      <div className="flex-1">
        <h3 className="font-semibold">Update available</h3>
        <p className="text-muted-foreground text-sm">
          A new version is available. Refresh to update.
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => updateServiceWorker(true)} className="flex-1">
          Refresh
        </Button>
        <Button
          variant="outline"
          onClick={() => setNeedRefresh(false)}
          className="flex-1"
        >
          Later
        </Button>
      </div>
    </div>
  );
}
