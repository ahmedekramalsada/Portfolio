'use client';

import { useEffect, useState } from 'react';
import { api, API_BASE_URL } from '@/services/api';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    // For now show system info — settings endpoint can be added later
  }, []);

  return (
    <div>
      <h1 className="h2 mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="mb-4 font-semibold">Site</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Site name: Ahmed Ekram Alsada</p>
            <p>Domain: ahmedekram.site</p>
            <p>Version: 0.1.0</p>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="mb-4 font-semibold">Admin</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Email: admin@ahmedekram.site</p>
            <p>API URL: {API_BASE_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
