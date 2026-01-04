import { Download } from 'lucide-react';

import { SettingsGroup } from './settings-group';
import { SettingsRow } from './settings-row';

export function DataTab() {
  return (
    <div className="space-y-6">
      <SettingsGroup title="Export">
        <SettingsRow
          icon={Download}
          label="Export All Data"
          value="Download a copy of your data"
        />
      </SettingsGroup>
    </div>
  );
}
