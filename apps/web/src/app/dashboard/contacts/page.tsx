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
      <h1 className="mb-6 text-2xl font-bold">Contact Messages</h1>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-3xl mb-2">📬</p>
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {/* List */}
          <div className="md:col-span-1 space-y-2">
            {contacts.map((c: any) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${selected?.id === c.id ? 'border-blue-500 bg-blue-500/5' : 'hover:bg-accent'}`}>
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-blue-500 hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => deleteContact(selected.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                </div>
                {selected.subject && (
                  <p className="text-sm font-medium mb-2">Subject: {selected.subject}</p>
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                <p className="mt-4 text-xs text-muted-foreground">Received {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
