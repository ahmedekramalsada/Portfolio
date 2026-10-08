import type { CSSProperties } from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export type NexArtwork =
  | 'hero' | 'portrait'
  | 'neutral' | 'serious' | 'happy' | 'thinking' | 'surprised' | 'speaking'
  | 'explain' | 'point' | 'think' | 'approve';

type NexCharacterProps = {
  artwork?: NexArtwork;
  motion?: boolean;
  style?: CSSProperties;
};

/** Approved raster artwork, not an approximate SVG or an articulated 3D model.
 * Only the whole panel moves; its silhouette, face and armor are unchanged.
 */
export function NexCharacter({ artwork = 'portrait', motion = false, style }: NexCharacterProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const drift = motion ? Math.sin(seconds * Math.PI * 0.6) * 4 : 0;

  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Img
        src={staticFile(`nex/${artwork}.png`)}
        alt={`NEX approved character artwork: ${artwork}`}
        style={{
          width: '100%', height: '100%', objectFit: 'contain',
          transform: `translateY(${drift}px)`,
        }}
      />
    </div>
  );
}
