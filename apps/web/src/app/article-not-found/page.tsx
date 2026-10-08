import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ArticleNotFound() {
  return (
    <div className="page text-center">
      <span className="label">404</span>
      <h1 className="h1 mt-5">This article does not exist</h1>
      <p className="lede mx-auto">The article was moved, deleted, or never published in this language.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/blog" className="btn-primary">Back to writing <span aria-hidden>→</span></Link>
        <Link href="/" className="btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
