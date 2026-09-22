'use client';

import { useRef } from 'react';

/**
 * A card that leans slightly toward the pointer. The tilt is decoration only:
 * with reduced motion, or on touch, the card simply stays flat and clickable.
 */
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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
    <a ref={ref} onMouseMove={handleMove} onMouseLeave={reset} className={`tilt ${className}`}>
      {children}
    </a>
  );
}
