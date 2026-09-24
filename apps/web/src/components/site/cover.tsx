'use client';

import { useState } from 'react';

type Props = { src?: string | null; alt: string; fallback: string; className?: string; fallbackFontSize?: string };

export function Cover({ src, alt, fallback, className, fallbackFontSize }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return <span className={`pcard-art ${className || ''}`} style={fallbackFontSize ? { fontSize: fallbackFontSize } : undefined}>{fallback}</span>;
  }

  return (
    <span className="relative block h-full w-full">
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${className || ''}`}
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth === 0) setFailed(true);
          else setLoaded(true);
        }}
        onError={() => setFailed(true)}
        style={{ display: loaded || failed ? 'block' : 'none' }}
      />
      {!loaded && !failed && <span className="pcard-art absolute inset-0" aria-hidden />}
    </span>
  );
}
