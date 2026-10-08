import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type ProjectShowcaseProps = {
  title: string;
  outcome: string;
  points: string[];
  stack: string[];
};

const BG = '#0c0e12';
const WARM = '#e8b04b';
const DIM = '#9aa0ab';
const CARD = '#15181e';

export function ProjectShowcase({ title, outcome, points, stack }: ProjectShowcaseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: 'system-ui, -apple-system, sans-serif', padding: 90 }}>
      <div
        style={{
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
          color: WARM,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
        }}
      >
        CASE STUDY
      </div>
      <div style={{ color: '#fff', fontSize: 84, fontWeight: 800, marginTop: 12 }}>{title}</div>
      <div style={{ color: DIM, fontSize: 34, marginTop: 12 }}>{outcome}</div>

      <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
        {points.map((point, i) => {
          const pop = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 16 } });
          return (
            <div
              key={point}
              style={{
                flex: 1,
                opacity: interpolate(frame, [15 + i * 12, 27 + i * 12], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(Math.max(pop, 0), [0, 1], [40, 0])}px)`,
                backgroundColor: CARD,
                border: '1px solid #262b34',
                borderRadius: 20,
                padding: '32px 28px',
                color: '#fff',
                fontSize: 30,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: WARM, fontWeight: 800, marginRight: 12 }}>0{i + 1}</span>
              {point}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 44 }}>
        {stack.map((tech, i) => {
          const pop = spring({ frame: frame - 45 - i * 6, fps, config: { damping: 14 } });
          return (
            <div
              key={tech}
              style={{
                transform: `scale(${Math.max(pop, 0.001)})`,
                border: '1px solid #3a4150',
                borderRadius: 999,
                padding: '10px 26px',
                color: '#dfe3e8',
                fontSize: 26,
              }}
            >
              {tech}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
