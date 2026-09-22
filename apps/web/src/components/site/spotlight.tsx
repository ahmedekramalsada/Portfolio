'use client';

import { useEffect } from 'react';

/**
 * Atmosphere layer: a warm light that follows the pointer plus a faint film
 * grain. Purely decorative, never interactive, and it respects a user who has
 * asked for reduced motion by staying still.
 */
export function Spotlight() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
        document.documentElement.style.setProperty('--my', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="spot" aria-hidden />
      <div className="grain" aria-hidden />
    </>
  );
}
