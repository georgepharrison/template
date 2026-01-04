import { Button } from '@/components/ui/button';

import { SettingsGroup } from './settings-group';

export function BillingTab() {
  return (
    <div className="space-y-6">
      <SettingsGroup title="Current Plan">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold">Free Plan</p>
              <p className="text-muted-foreground text-sm">
                Upgrade for more features
              </p>
            </div>
            <span className="text-2xl font-bold">
              $0
              <span className="text-muted-foreground text-sm">/mo</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button>Upgrade Plan</Button>
            <Button variant="outline">Manage Billing</Button>
          </div>
        </div>
      </SettingsGroup>
    </div>
  );
}
