'use client';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto max-w-xl px-4 py-20 text-center">
      <div className="rounded-xl border border-dashed p-12">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button onClick={() => reset()} className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Try again
        </button>
        <a href="/" className="ml-3 rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
          Go home
        </a>
      </div>
    </div>
  );
}
