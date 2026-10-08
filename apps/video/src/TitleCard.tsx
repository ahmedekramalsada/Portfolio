import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type TitleCardProps = {
  hook: string;
  sub: string;
  tag: string;
};

const BG = '#0c0e12';
const WARM = '#e8b04b';
const DIM = '#9aa0ab';
const CARD = '#15181e';

export function TitleCard({ hook, sub, tag }: TitleCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const barScale = spring({ frame: frame - 8, fps, config: { damping: 20 } });
  const tagPop = spring({ frame: frame - 18, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade }}>
        <div
          style={{
            transform: `translateY(${interpolate(rise, [0, 1], [60, 0])}px)`,
            backgroundColor: CARD,
            border: '1px solid #262b34',
            borderRadius: 24,
            padding: '56px 72px',
            maxWidth: '80%',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              transform: `scale(${Math.max(tagPop, 0.001)})`,
              color: '#0c0e12',
              backgroundColor: WARM,
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {tag}
          </div>
          <div style={{ color: '#fff', fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginTop: 28 }}>
            {hook}
          </div>
          <div
            style={{
              transform: `scaleX(${Math.max(barScale, 0.001)})`,
              transformOrigin: 'left',
              height: 6,
              width: 180,
              backgroundColor: WARM,
              borderRadius: 3,
              marginTop: 28,
            }}
          />
          <div style={{ color: DIM, fontSize: 32, marginTop: 24 }}>{sub}</div>
        </div>
        <div style={{ position: 'absolute', bottom: 48, color: DIM, fontSize: 24, letterSpacing: 3 }}>
          AHMED EKRAM ALSADA · DevOps ENGINEER
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
