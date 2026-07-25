'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    // For now show system info — settings endpoint can be added later
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Site</h2>
          <div className="space-y-2 text-sm">
            <p>Site name: Ahmed Ekram Al Sada</p>
            <p>Domain: ahmedekram.site</p>
            <p>Version: 0.1.0</p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold">Admin</h2>
          <div className="space-y-2 text-sm">
            <p>Email: admin@ahmedekram.site</p>
            <p>API URL: http://localhost:4000/api/v1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
