'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.get('/contacts?limit=100').then((data: any) => setContacts(data || [])).catch(() => {});
  }, []);

  const deleteContact = async (id: string) => {
    if (confirm('Delete this message?')) {
      await api.delete(`/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="h2 mb-6">Contact Messages</h1>

      {contacts.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-line bg-card p-12 text-center">
          <p className="mb-2 text-3xl">📬</p>
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {/* List */}
          <div className="space-y-2 md:col-span-1">
            {contacts.map((c: any) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full rounded-[12px] border p-3 text-left transition-colors ${
                  selected?.id === c.id
                    ? 'border-warm/40 bg-warm/10'
                    : 'border-line bg-card hover:border-line-2 hover:bg-muted'
                }`}>
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="panel p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-warm hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => deleteContact(selected.id)}
                    className="shrink-0 rounded-[10px] border border-line-2 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground">Delete</button>
                </div>
                {selected.subject && (
                  <p className="mb-2 text-sm font-medium">Subject: {selected.subject}</p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{selected.message}</p>
                <p className="mt-4 text-xs text-dim">Received {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-line bg-card p-12 text-center">
                <p className="text-muted-foreground">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
