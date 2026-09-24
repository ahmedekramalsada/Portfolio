'use client';

import { useEffect, useState } from 'react';
import { api, API_BASE_URL } from '@/services/api';

export default function MediaAdminPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const result = await api.get<{ data?: any[] }>('/media?limit=50');
    setFiles(result.data || []);
  };
  useEffect(() => { void load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      await load();
    } catch {}
    setUploading(false);
  };

  return (
    <div>
      <h1 className="h2 mb-6">Media Library</h1>

      <div className="mb-8 rounded-[14px] border border-dashed border-line bg-card p-8 text-center transition-colors hover:border-warm/40">
        <label className="cursor-pointer">
          <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload (max 10MB)'}</p>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((f: any) => (
            <div key={f.id} className="panel p-3">
              <p className="truncate text-sm font-medium">{f.originalName}</p>
              <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
