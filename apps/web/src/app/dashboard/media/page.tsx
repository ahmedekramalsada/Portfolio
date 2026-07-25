'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function MediaAdminPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => api.get('/media?limit=50').then((r: any) => setFiles(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch('http://localhost:4000/api/v1/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        body: formData,
      });
      load();
    } catch {}
    setUploading(false);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Media Library</h1>

      <div className="mb-8 rounded-lg border border-dashed p-8 text-center">
        <label className="cursor-pointer">
          <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload (max 10MB)'}</p>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {files.map((f: any) => (
            <div key={f.id} className="rounded-lg border p-3">
              <p className="truncate text-sm font-medium">{f.originalName}</p>
              <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
