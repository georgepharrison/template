import { AlertTriangle, Trash2 } from 'lucide-react';

import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

export function DangerTab() {
  return (
    <div className="space-y-6">
      <SettingsGroup title="Destructive Actions" variant="danger">
        <SettingsRow icon={Trash2} label="Delete Personal Data" danger />
        <SettingsRow icon={AlertTriangle} label="Delete Account" danger />
      </SettingsGroup>
    </div>
  );
}
