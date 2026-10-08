import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const BG = '#0c0e12';
const WARM = '#e8b04b';
const DIM = '#9aa0ab';
const CARD = '#15181e';
const RED = '#e05d4f';
const GREEN = '#5fc98a';
const FONT = 'system-ui, -apple-system, sans-serif';

// 60 seconds @ 60fps. Boundaries matched to the script's estimated VO pace.
export const S1_END = 300;
export const S2_END = 720;
export const S3_END = 1140;
export const S4_END = 1560;
export const S5_END = 1980;
export const S6_END = 2520;
export const S7_END = 2940;
export const TOTAL = 3600;

function Rise({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const fade = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity: fade, transform: `translateY(${interpolate(rise, [0, 1], [50, 0])}px)` }}>
      {children}
    </div>
  );
}

function Pop({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  return (
    <div
      style={{
        opacity: interpolate(frame - delay, [0, 14], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${Math.max(pop, 0.001)})`,
      }}
    >
      {children}
    </div>
  );
}

function Kicker({ children, color = DIM }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ color, fontSize: 32, letterSpacing: 5, fontWeight: 700, textAlign: 'center' }}>{children}</div>
  );
}

// ─── Scene 1: Hook ─────────────────────────────────────────────
function HookScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Rise>
        <div style={{ color: RED, fontSize: 44, fontWeight: 800, letterSpacing: 8, textAlign: 'center' }}>
          ONE DEPLOY
        </div>
      </Rise>
      <Rise delay={60}>
        <div style={{ color: '#fff', fontSize: 120, fontWeight: 800, textAlign: 'center', marginTop: 20, lineHeight: 1.05 }}>
          20 MINUTES OF
          <br />
          DOWNTIME
        </div>
      </Rise>
      <Rise delay={150}>
        <div style={{ color: DIM, fontSize: 42, textAlign: 'center', marginTop: 36 }}>
          caused by <span style={{ color: WARM, fontWeight: 700 }}>one missing line</span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

// ─── Scene 2: The old way ──────────────────────────────────────
function StepBox({ label, delay, accent }: { label: string; delay: number; accent?: boolean }) {
  return (
    <Pop delay={delay}>
      <div
        style={{
          backgroundColor: CARD,
          border: `3px solid ${accent ? RED : '#2b313c'}`,
          borderRadius: 22,
          padding: '30px 48px',
          color: accent ? RED : '#fff',
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        {label}
      </div>
    </Pop>
  );
}

function OldWayScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker>THE OLD WAY</Kicker>
      <div style={{ display: 'flex', gap: 30, marginTop: 48, alignItems: 'center' }}>
        <StepBox label="STOP" delay={20} />
        <div style={{ color: DIM, fontSize: 48 }}>→</div>
        <StepBox label="SWAP" delay={75} accent />
        <div style={{ color: DIM, fontSize: 48 }}>→</div>
        <StepBox label="RESTART" delay={130} />
      </div>
      <Rise delay={220}>
        <div style={{ color: DIM, fontSize: 40, marginTop: 52 }}>
          Simple. <span style={{ color: '#fff', fontWeight: 700 }}>And broken.</span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

// ─── Scene 3: The cost ─────────────────────────────────────────
function CostScene() {
  const frame = useCurrentFrame();
  const remaining = Math.max(0, 90 - Math.floor(frame / 4));
  const losses = ['ORDERS', 'SIGNUPS', 'TRUST'];
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker color={RED}>NOBODY CAN REACH YOU FOR</Kicker>
      <div style={{ color: '#fff', fontSize: 170, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
        00:{String(remaining).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
        {losses.map((loss, i) => (
          <Pop key={loss} delay={120 + i * 50}>
            <div
              style={{
                backgroundColor: '#2a1512',
                border: `2px solid ${RED}`,
                borderRadius: 14,
                padding: '14px 36px',
                color: RED,
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              {loss} ✕
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: In-flight requests ─────────────────────────────────
function InflightScene() {
  const frame = useCurrentFrame();
  const killAt = 200;
  const dead = frame >= killAt;
  const pips = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker>REQUESTS IN FLIGHT</Kicker>
      <div style={{ display: 'flex', gap: 22, marginTop: 48 }}>
        {pips.map((i) => (
          <Pop key={i} delay={20 + i * 25}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 24,
                display: 'grid',
                placeItems: 'center',
                fontSize: 52,
                fontWeight: 800,
                backgroundColor: dead ? '#2a1512' : CARD,
                border: `3px solid ${dead ? RED : '#2b313c'}`,
                color: dead ? RED : WARM,
                transform: dead ? `rotate(${(i % 2 === 0 ? 1 : -1) * 8}deg)` : undefined,
              }}
            >
              {dead ? '✕' : '●'}
            </div>
          </Pop>
        ))}
      </div>
      <div style={{ height: 90, marginTop: 20 }}>
        {dead && (
          <Pop delay={0}>
            <div
              style={{
                backgroundColor: RED,
                color: '#0c0e12',
                fontWeight: 800,
                fontSize: 40,
                borderRadius: 14,
                padding: '14px 52px',
              }}
            >
              RESTART KILLS THEM ALL
            </div>
          </Pop>
        )}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: The insight ────────────────────────────────────────
function ServerBox({ version, state, delay, active }: { version: string; state: string; delay: number; active: boolean }) {
  return (
    <Pop delay={delay}>
      <div
        style={{
          backgroundColor: CARD,
          border: `3px solid ${active ? GREEN : WARM}`,
          borderRadius: 24,
          padding: '40px 56px',
          textAlign: 'center',
          minWidth: 420,
        }}
      >
        <div style={{ color: '#fff', fontSize: 64, fontWeight: 800 }}>{version}</div>
        <div style={{ color: active ? GREEN : WARM, fontSize: 32, fontWeight: 700, marginTop: 12 }}>{state}</div>
      </div>
    </Pop>
  );
}

function InsightScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker color={WARM}>NEVER LEAVE THE CHAIR EMPTY</Kicker>
      <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
        <ServerBox version="v1" state="● SERVING" delay={30} active />
        <ServerBox version="v2" state="▲ STARTING" delay={110} active={false} />
      </div>
      <Rise delay={220}>
        <div style={{ color: DIM, fontSize: 38, marginTop: 48 }}>
          Start the new <span style={{ color: '#fff', fontWeight: 700 }}>before</span> you stop the old
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

// ─── Scene 6: Health-gated switch ────────────────────────────────
function PipeNode({ label, delay, ok }: { label: string; delay: number; ok?: boolean }) {
  return (
    <Pop delay={delay}>
      <div
        style={{
          backgroundColor: CARD,
          border: `3px solid ${ok ? GREEN : '#2b313c'}`,
          borderRadius: 20,
          padding: '26px 34px',
          color: '#fff',
          fontSize: 36,
          fontWeight: 800,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {ok && <span style={{ color: GREEN }}>✓ </span>}
        {label}
      </div>
    </Pop>
  );
}

function Wire({ delay }: { delay: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  return (
    <div style={{ width: 56, height: 7, borderRadius: 4, backgroundColor: WARM, transform: `scaleX(${Math.max(grow, 0.001)})` }} />
  );
}

function HealthScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker color={WARM}>THE FIX</Kicker>
      <div style={{ display: 'flex', gap: 10, marginTop: 52, alignItems: 'center' }}>
        <PipeNode label="v2 BOOTS" delay={20} />
        <Wire delay={80} />
        <PipeNode label="HEALTH CHECK" delay={100} ok />
        <Wire delay={190} />
        <PipeNode label="MOVE TRAFFIC" delay={210} />
        <Wire delay={280} />
        <PipeNode label="RETIRE v1" delay={300} />
      </div>
      <Rise delay={380}>
        <div style={{ color: DIM, fontSize: 40, marginTop: 56 }}>Slowly. Safely. Traffic moves only when healthy.</div>
      </Rise>
    </AbsoluteFill>
  );
}

// ─── Scene 7: Free rollback ──────────────────────────────────────
function RollbackScene() {
  const frame = useCurrentFrame();
  const shake = frame >= 180 && frame < 220 ? Math.sin(frame * 1.5) * 10 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Kicker color={RED}>CHECK FAILED?</Kicker>
      <div style={{ display: 'flex', gap: 30, marginTop: 48, alignItems: 'center' }}>
        <Pop delay={30}>
          <div style={{ backgroundColor: CARD, border: '3px solid #2b313c', borderRadius: 22, padding: '30px 48px', color: '#fff', fontSize: 48, fontWeight: 800 }}>
            TRAFFIC
          </div>
        </Pop>
        <Pop delay={110}>
          <div
            style={{
              backgroundColor: RED,
              color: '#0c0e12',
              borderRadius: 16,
              padding: '24px 44px',
              fontSize: 44,
              fontWeight: 800,
              transform: `translateX(${shake}px)`,
            }}
          >
            STAYS PUT
          </div>
        </Pop>
      </div>
      <Rise delay={240}>
        <div style={{ color: '#fff', fontSize: 52, fontWeight: 800, marginTop: 56 }}>
          Rollback = doing <span style={{ color: GREEN }}>absolutely nothing</span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
}

// ─── Scene 8: Payoff ─────────────────────────────────────────────
function PayoffScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, justifyContent: 'center', alignItems: 'center' }}>
      <Rise>
        <div style={{ color: '#fff', fontSize: 130, fontWeight: 800 }}>BORING RELEASES.</div>
      </Rise>
      <Rise delay={70}>
        <div style={{ color: WARM, fontSize: 52, fontWeight: 700, marginTop: 20 }}>Deploy on Friday afternoons.</div>
      </Rise>
      <Rise delay={170}>
        <div style={{ marginTop: 56, backgroundColor: WARM, color: '#0c0e12', fontWeight: 800, fontSize: 36, borderRadius: 999, padding: '20px 60px' }}>
          Follow for one DevOps lesson every week
        </div>
      </Rise>
      <div style={{ position: 'absolute', bottom: 52, color: DIM, fontSize: 26, letterSpacing: 4 }}>
        AHMED EKRAM ALSADA · DevOps ENGINEER
      </div>
    </AbsoluteFill>
  );
}

export function ZeroDowntimeDeploys() {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={0} durationInFrames={S1_END}>
        <HookScene />
      </Sequence>
      <Sequence from={S1_END} durationInFrames={S2_END - S1_END}>
        <OldWayScene />
      </Sequence>
      <Sequence from={S2_END} durationInFrames={S3_END - S2_END}>
        <CostScene />
      </Sequence>
      <Sequence from={S3_END} durationInFrames={S4_END - S3_END}>
        <InflightScene />
      </Sequence>
      <Sequence from={S4_END} durationInFrames={S5_END - S4_END}>
        <InsightScene />
      </Sequence>
      <Sequence from={S5_END} durationInFrames={S6_END - S5_END}>
        <HealthScene />
      </Sequence>
      <Sequence from={S6_END} durationInFrames={S7_END - S6_END}>
        <RollbackScene />
      </Sequence>
      <Sequence from={S7_END} durationInFrames={TOTAL - S7_END}>
        <PayoffScene />
      </Sequence>
    </AbsoluteFill>
  );
}
