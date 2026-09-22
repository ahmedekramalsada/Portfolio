import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="page text-center">
      <span className="label">404</span>
      <h1 className="h1 mt-5">This page does not exist</h1>
      <p className="lede mx-auto">
        The address you followed is wrong, or the page has been moved.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Go home <span aria-hidden>→</span></Link>
        <Link href="/blog" className="btn-ghost">Read the writing</Link>
      </div>
    </div>
  );
}
