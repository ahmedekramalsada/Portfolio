import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const J = {
  bg: '#05080e',
  cyan: '#3ee6ff',
  blue: '#2f7bff',
  ice: '#eaf6ff',
  dim: '#7d8ea3',
  card: '#0a1220',
  line: '#16283d',
  red: '#ff5d5d',
  green: '#52e0a0',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: 'system-ui, -apple-system, sans-serif',
};

// The Core — your holographic AI character.
// Modes: 'boot' (igniting), 'idle' (breathing), 'speak' (pulsing + fast rings).
export function Core({ mode, size = 420 }: { mode: 'boot' | 'idle' | 'speak'; size?: number }) {
  const frame = useCurrentFrame();
  const boot = mode === 'boot' ? interpolate(frame, [0, 70], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  const speed = mode === 'speak' ? 2.2 : mode === 'boot' ? 3 : 0.5;
  const floatY = mode === 'idle' ? Math.sin(frame / 45) * 8 : 0;
  const pulsePhase = (frame % 60) / 60;
  const pulseR = mode === 'speak' ? 130 + pulsePhase * 90 : 130;
  const pulseO = mode === 'speak' ? 0.7 * (1 - pulsePhase) : 0;

  return (
    <div style={{ width: size, height: size, transform: `translateY(${floatY}px) scale(${Math.max(boot, 0.001)})`, opacity: boot }}>
      <svg width={size} height={size} viewBox="0 0 400 400">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={J.cyan} stopOpacity="0.95" />
            <stop offset="35%" stopColor={J.cyan} stopOpacity="0.45" />
            <stop offset="70%" stopColor={J.blue} stopOpacity="0.12" />
            <stop offset="100%" stopColor={J.blue} stopOpacity="0" />
          </radialGradient>
        </defs>
        {mode === 'speak' && (
          <circle cx="200" cy="200" r={pulseR} fill="none" stroke={J.cyan} strokeWidth="2" opacity={pulseO} />
        )}
        <g style={{ transformOrigin: '200px 200px', transform: `rotate(${frame * speed}deg)` }}>
          <circle cx="200" cy="200" r="170" fill="none" stroke={J.cyan} strokeWidth="2" strokeDasharray="60 26" opacity="0.8" />
          <circle cx="200" cy="370" r="7" fill={J.cyan} />
        </g>
        <g style={{ transformOrigin: '200px 200px', transform: `rotate(${-frame * speed * 0.6}deg)` }}>
          <circle cx="200" cy="200" r="140" fill="none" stroke={J.blue} strokeWidth="1.5" strokeDasharray="10 14" opacity="0.9" />
        </g>
        <circle cx="200" cy="200" r="120" fill="url(#coreGlow)" />
        <circle cx="200" cy="200" r="46" fill={J.cyan} opacity="0.9" />
        <circle cx="200" cy="200" r="46" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <circle cx="186" cy="186" r="12" fill="#ffffff" opacity="0.85" />
      </svg>
    </div>
  );
}

// Fake voice waveform — deterministic, looks alive under narration.
export function Waveform({ width = 640, bars = 28, height = 90 }: { width?: number; bars?: number; height?: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 12 + Math.abs(Math.sin(frame / 7 + i * 0.7)) * (height - 12) * Math.abs(Math.sin(i * 1.3 + 1));
        return <div key={i} style={{ flex: 1, height: h, borderRadius: 4, backgroundColor: J.cyan, opacity: 0.85 }} />;
      })}
    </div>
  );
}

// HUD frame: corner brackets + top status line + bottom branding bug.
export function HudFrame({ children, status = 'SYS.ONLINE' }: { children: React.ReactNode; status?: string }) {
  const B = 46;
  const bracket: React.CSSProperties = { position: 'absolute', width: 56, height: 56, borderColor: J.cyan, opacity: 0.7 };
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: J.mono }}>
      <div style={{ ...bracket, top: B, left: B, borderTop: '3px solid', borderLeft: '3px solid' }} />
      <div style={{ ...bracket, top: B, right: B, borderTop: '3px solid', borderRight: '3px solid' }} />
      <div style={{ ...bracket, bottom: B, left: B, borderBottom: '3px solid', borderLeft: '3px solid' }} />
      <div style={{ ...bracket, bottom: B, right: B, borderBottom: '3px solid', borderRight: '3px solid' }} />
      <div style={{ position: 'absolute', top: B + 8, left: B + 80, color: J.cyan, fontSize: 22, letterSpacing: 3 }}>
        ● {status}
      </div>
      <div style={{ position: 'absolute', bottom: B + 8, left: 0, right: 0, textAlign: 'center', color: J.dim, fontSize: 22, letterSpacing: 4 }}>
        AHMED EKRAM ALSADA · DevOps ENGINEER
      </div>
      {children}
    </div>
  );
}

// Karaoke caption: words light up one by one, timed by `cps` (chars/sec feel).
export function KaraokeCaption({ words, from, perWord = 14 }: { words: string[]; from: number; perWord?: number }) {
  const frame = useCurrentFrame();
  const lit = Math.floor((frame - from) / perWord);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 22px', justifyContent: 'center', maxWidth: 880, fontFamily: J.sans }}>
      {words.map((w, i) => (
        <span key={i} style={{ color: i <= lit ? J.ice : '#2a3a4f', fontSize: 56, fontWeight: 800, textShadow: i === lit ? `0 0 26px ${J.cyan}` : undefined }}>
          {w}
        </span>
      ))}
    </div>
  );
}

// Question card: one question per concept, rick-style but ours.
export function QuestionCard({ kicker, question, delay = 0 }: { kicker: string; question: string; delay?: number }) {
  const frame = useCurrentFrame();
  const pop = spring({ frame: frame - delay, fps: 60, config: { damping: 15 } });
  return (
    <div
      style={{
        opacity: interpolate(frame - delay, [0, 14], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${Math.max(pop, 0.001)})`,
        border: `2px dashed ${J.line}`,
        borderRadius: 28,
        padding: '44px 52px',
        backgroundColor: J.card,
        width: 860,
      }}
    >
      <div style={{ fontFamily: J.mono, color: J.cyan, fontSize: 30, letterSpacing: 5 }}>{kicker}</div>
      <div style={{ fontFamily: J.sans, color: J.ice, fontSize: 62, fontWeight: 800, marginTop: 16, lineHeight: 1.15 }}>{question}</div>
    </div>
  );
}
