'use client';

import { useRef } from 'react';
import Link from 'next/link';

/**
 * A card that leans slightly toward the pointer and links somewhere. The tilt is
 * decoration only: with reduced motion, or on touch, the card stays flat and
 * remains a normal link.
 */
export function TiltCard({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-5px)`;
  };

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = '';
  };

  return (
    <Link ref={ref} href={href} onMouseMove={handleMove} onMouseLeave={reset} className={`tilt ${className}`}>
      {children}
    </Link>
  );
}
