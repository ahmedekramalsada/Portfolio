import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-20 text-center">
      <div className="rounded-xl border border-dashed p-12">
        <p className="text-6xl mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
