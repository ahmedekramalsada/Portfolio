'use client';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page text-center">
      <span className="label">Error</span>
      <h1 className="h1 mt-5">Something went wrong</h1>
      <p className="lede mx-auto">{error.message || 'An unexpected error occurred.'}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <button onClick={() => reset()} className="btn-primary">Try again</button>
        <a href="/" className="btn-ghost">Go home</a>
      </div>
    </div>
  );
}
