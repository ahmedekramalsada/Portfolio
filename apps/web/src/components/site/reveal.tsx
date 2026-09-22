'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Marks the document as JS-ready so the reveal animation only hides content
 * when JavaScript is present. Without this, a reveal element would stay
 * invisible forever on a broken script — content must never depend on JS.
 */
export function MotionProvider() {
  useEffect(() => {
    document.documentElement.classList.add('js-ready');
    return () => document.documentElement.classList.remove('js-ready');
  }, []);
  return null;
}

/** Fades its children in once they scroll into view. */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/**
 * Counts up to a number when it scrolls into view. The final value is rendered
 * by the server, so the real figure is present even before the animation runs.
 */
export function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setInterval>;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          setShown(0);
          let n = 0;
          timer = setInterval(() => {
            n += 1;
            setShown(n);
            if (n >= value) clearInterval(timer);
          }, 80);
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [value]);

  return (
    <div ref={ref} className="reveal px-6 py-7 sm:px-6">
      <b className="block text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{shown}</b>
      <span className="mt-3 block text-[13px] text-muted-foreground">{label}</span>
    </div>
  );
}
