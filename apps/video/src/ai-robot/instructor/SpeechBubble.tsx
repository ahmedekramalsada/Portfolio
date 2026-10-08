import {useCurrentFrame, interpolate, spring} from 'remotion';

/**
 * SpeechBubble — a chat-bubble next to the instructor with a
 * typewriter reveal of the current line.
 */
export const SpeechBubble: React.FC<{
  text: string;
  x: number; // center x
  y: number; // center y
  frameOffset?: number; // frame since the line started
  maxWidth?: number;
}> = ({text, x, y, frameOffset = 0, maxWidth = 300}) => {
  const frame = useCurrentFrame() - frameOffset;
  const inProgress = spring({frame, fps: 30, config: {damping: 14, stiffness: 110}});
  const chars = Math.min(text.length, Math.max(0, Math.floor(frame / 1.6)));
  const shown = text.slice(0, chars);
  const done = chars >= text.length;

  if (frame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - maxWidth / 2,
        top: y - 60,
        width: maxWidth,
        minHeight: 60,
        transform: `scale(${0.8 + inProgress * 0.2})`,
        opacity: inProgress,
        background: 'rgba(255,255,255,0.96)',
        color: '#0A0D1D',
        borderRadius: 18,
        padding: '14px 18px',
        fontSize: 16,
        lineHeight: 1.45,
        fontWeight: 600,
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
      }}
    >
      {shown}
      {!done && <span style={{opacity: 0.4}}>▌</span>}
      {/* tail */}
      <div
        style={{
          position: 'absolute',
          bottom: -10,
          left: 40,
          width: 20,
          height: 20,
          background: 'rgba(255,255,255,0.96)',
          transform: 'rotate(45deg)',
          borderRadius: 4,
        }}
      />
    </div>
  );
};
