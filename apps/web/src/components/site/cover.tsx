'use client';

/**
 * Post image with a designed fallback. Cover uploads can go stale — the stored
 * URL may point at a file that is no longer on the media host — so a broken
 * image swaps to the same gradient monogram the design uses elsewhere instead
 * of showing the browser's broken-image icon.
 */

import { useState } from 'react';

type Props = {
  src?: string;
  alt: string;
  /** Letter shown when there is no usable image (category or title initial). */
  fallback: string;
  className?: string;
  fallbackFontSize?: string;
};

export function Cover({ src, alt, fallback, className, fallbackFontSize }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className={`pcard-art ${className || ''}`} style={fallbackFontSize ? { fontSize: fallbackFontSize } : undefined}>
        {fallback}
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}
