'use client';

export function DownloadButton() {
  return (
    <button onClick={() => window.print()} className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent">
      Download PDF
    </button>
  );
}
