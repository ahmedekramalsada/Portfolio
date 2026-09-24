'use client';

import { useEffect, useState } from 'react';
import { api, API_BASE_URL } from '@/services/api';

type Setting = {
  id: string;
  key: string;
  value: string;
  group: string | null;
  type: string;
  public: boolean;
};

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setSettings(await api.get<Setting[]>('/settings'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load settings');
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.patch('/settings', { settings: settings.map((setting) => ({ key: setting.key, value: setting.value, group: setting.group, type: setting.type, public: setting.public })) });
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="h2">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage public and private site configuration stored in D1.</p>
      </div>

      <form onSubmit={save} className="panel max-w-4xl space-y-4 p-6">
        {settings.map((setting) => (
          <div key={setting.id} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center">
            <div><p className="font-mono text-sm text-foreground">{setting.key}</p><p className="mt-1 text-xs text-muted-foreground">{setting.group || 'General'} · {setting.public ? 'Public' : 'Private'}</p></div>
            <input className="field" aria-label={`Value for ${setting.key}`} value={setting.value} onChange={(event) => setSettings((current) => current.map((item) => item.id === setting.id ? { ...item, value: event.target.value } : item))} />
          </div>
        ))}
        {settings.length === 0 && <p className="text-sm text-muted-foreground">No settings found.</p>}
        {error && <p className="rounded-xl border border-[#6d3b34] bg-[#2a1614] px-4 py-3 text-sm text-[#e8977f]">{error}</p>}
        <div className="flex flex-wrap gap-3"><button type="submit" className="btn-primary" disabled={saving || settings.length === 0}>{saving ? 'Saving…' : 'Save settings'}</button><span className="self-center font-mono text-xs text-dim">API: {API_BASE_URL}</span></div>
      </form>
    </div>
  );
}
