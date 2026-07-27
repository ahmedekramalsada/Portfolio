export default function LoadingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-10 w-64 rounded bg-muted mb-4" />
        <div className="h-5 w-96 rounded bg-muted mb-12" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
          <div className="h-48 w-full rounded-lg bg-muted mt-6" />
          <div className="h-4 w-full rounded bg-muted mt-6" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
