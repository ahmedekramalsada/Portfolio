'use client';

export function DownloadButton() {
  return (
    <button onClick={() => window.print()} className="btn-ghost">
      Download PDF <span aria-hidden>↓</span>
    </button>
  );
}
