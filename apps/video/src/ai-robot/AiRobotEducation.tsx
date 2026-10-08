/**
 * AiRobotEducation.tsx
 * ------------------------------------------------------------------
 * Educational version of the Ai Robot animation: popup callouts that
 * point at the REAL parts of the robot, in the correct places, and
 * that TRACK the robot's own animation (body bob, eye darts, ear darts).
 *
 * Props:
 *   showPopups   - toggle ALL popups on/off (default true)
 *   frameOffset  - aligns this composition's timeline with a parent
 */
import {useCurrentFrame, interpolate, spring, Sequence} from 'remotion';
import {Lottie} from '@remotion/lottie';
import robotData from './ai-robot.json';

const W = 682;
const H = 902;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pt = [number, number];
type Kfs = Array<{t: number; s: number[]}>;

/** Linear-interpolated [x,y] of a `.ks.p.k` value at frame f. */
const ptAt = (k: unknown, f: number): Pt => {
  if (Array.isArray(k) && typeof (k as number[])[0] === 'number') {
    const v = k as number[];
    return [v[0], v[1]];
  }
  const kfs = k as Kfs;
  if (!Array.isArray(kfs) || kfs.length === 0) return [0, 0];
  if (f <= kfs[0].t) return [kfs[0].s[0], kfs[0].s[1]];
  for (let i = 0; i < kfs.length - 1; i++) {
    if (f <= kfs[i + 1].t) {
      const p = kfs[i], n = kfs[i + 1];
      const t = p.t === n.t ? 0 : (f - p.t) / (n.t - p.t);
      return [p.s[0] + (n.s[0] - p.s[0]) * t, p.s[1] + (n.s[1] - p.s[1]) * t];
    }
  }
  const last = kfs[kfs.length - 1];
  return [last.s[0], last.s[1]];
};

const LAYERS = new Map(
  (robotData.layers as Array<{nm: string}>).map((l) => [l.nm, l as any])
);
const bodyL = LAYERS.get('body') as any;
const faceL = LAYERS.get('Face') as any;
const eyesL = LAYERS.get('eyes') as any;
const earsL = LAYERS.get('ears') as any;

const deltaOf = (layer: any, f: number): Pt => {
  const p = ptAt(layer.ks.p.k, f);
  const k = layer.ks.p.k;
  const rest: Pt = Array.isArray(k) && typeof (k as number[])[0] === 'number'
    ? [(k as number[])[0], (k as number[])[1]]
    : [(k as Kfs)[0].s[0], (k as Kfs)[0].s[1]];
  return [p[0] - rest[0], p[1] - rest[1]];
};

const bodyDelta = (f: number): Pt => deltaOf(bodyL, f);
const faceDelta = (f: number): Pt => deltaOf(faceL, f);
const eyesDelta = (f: number): Pt => deltaOf(eyesL, f);
const earsDelta = (f: number): Pt => deltaOf(earsL, f);

type Track = 'body' | 'face' | 'eyes' | 'ears' | 'none';
const ptAdd = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const TRACKS: Record<Track, (f: number) => Pt> = {
  body: (f) => bodyDelta(f),
  face: (f) => ptAdd(bodyDelta(f), faceDelta(f)),
  eyes: (f) => ptAdd(ptAdd(bodyDelta(f), faceDelta(f)), eyesDelta(f)),
  ears: (f) => ptAdd(bodyDelta(f), earsDelta(f)),
  none: () => [0, 0] as Pt,
};



type Callout = {
  appear: number;
  leave: number;
  track: Track;
  title: string;
  text: string;
  color: string;
  anchors: Array<{x: number; y: number; r: number}>;
  card: {x: number; y: number; w: number; h: number};
};


const CALLOUTS: Callout[] = [
  {appear: 30, leave: 75, track: 'ears', title: 'Antenna', text: 'Sends & receives wireless signals', color: '#54E0EF', anchors: [{x: 340, y: 142, r: 34}], card: {x: 356, y: 44, w: 310, h: 92}},
  {appear: 78, leave: 123, track: 'ears', title: 'Ears', text: 'Audio sensors — the robot hears you', color: '#7BE0FF', anchors: [{x: 105, y: 270, r: 40}, {x: 575, y: 270, r: 40}], card: {x: 356, y: 350, w: 310, h: 92}},
  {appear: 126, leave: 171, track: 'eyes', title: 'Eyes', text: 'Visual sensors — how it sees the world', color: '#96F5FF', anchors: [{x: 248, y: 276, r: 30}, {x: 432, y: 276, r: 30}], card: {x: 14, y: 44, w: 300, h: 92}},
  {appear: 174, leave: 219, track: 'face', title: 'Face Screen', text: 'Displays emotions, data and status', color: '#4FD1FF', anchors: [{x: 340, y: 300, r: 110}], card: {x: 14, y: 350, w: 290, h: 92}},
  {appear: 222, leave: 256, track: 'body', title: 'Hands', text: 'Manipulators — they wave hello!', color: '#54E0EF', anchors: [{x: 126, y: 594, r: 46}, {x: 554, y: 594, r: 46}], card: {x: 236, y: 706, w: 330, h: 92}},
  {appear: 264, leave: 288, track: 'body', title: 'Body & Data', text: 'CPU + power core, floating data objects', color: '#7BE0FF', anchors: [{x: 340, y: 520, r: 80}, {x: 340, y: 845, r: 30}], card: {x: 366, y: 576, w: 300, h: 92}},
];


const springIn = (frame: number, start: number): number =>
  spring({frame: frame - start, fps: 30, config: {damping: 14, stiffness: 120, mass: 0.8}});

export const AiRobotEducation: React.FC<{showPopups?: boolean; frameOffset?: number}> = ({
  showPopups = true,
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - frameOffset);

  const titleIn = springIn(local, 2);
  const titleOpacity = interpolate(local, [30, 40], [1, 0], {extrapolateRight: 'clamp'});
  const endIn = springIn(local, 290);
  const endOpacity = interpolate(local, [290, 298], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        width: W,
        height: H,
        background: 'radial-gradient(ellipse at 50% 35%, #131A33 0%, #0A0D1D 55%, #060812 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(84,224,239,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(84,224,239,0.05) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      <div style={{position: 'absolute', inset: 0}}>
        <Sequence from={frameOffset} layout="none">
          <Lottie animationData={robotData} loop style={{width: '100%', height: '100%'}} />
        </Sequence>
      </div>

      {local < 42 && (
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 30,
            right: 30,
            textAlign: 'center',
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleIn) * -30}px) scale(${0.9 + titleIn * 0.1})`,
          }}
        >
          <div style={{color: '#54E0EF', fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10}}>
            Anatomy of
          </div>
          <div style={{color: '#FFFFFF', fontSize: 34, fontWeight: 800, lineHeight: 1.15}}>
            Your AI Robot
          </div>
        </div>
      )}

      {showPopups && CALLOUTS.map((c) => <Callout key={c.title} spec={c} frame={local} />)}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(6,8,18,0.82)',
          opacity: endOpacity,
          transform: `scale(${0.85 + endIn * 0.15})`,
          pointerEvents: 'none',
        }}
      >
        <div style={{color: '#54E0EF', fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12}}>
          You now know every part
        </div>
        <div style={{color: '#FFFFFF', fontSize: 32, fontWeight: 800, textAlign: 'center'}}>
          Every part is customizable
        </div>
        <div style={{color: '#9FB2C8', fontSize: 15, marginTop: 12}}>
          colors · shapes · timing · popups
        </div>
      </div>
    </div>
  );
};

/** one popup card + glowing dots + connector lines, anchored to parts */
const Callout: React.FC<{spec: Callout; frame: number}> = ({spec, frame}) => {
  const {appear, leave, title, text, color, anchors, card, track} = spec;
  const inProgress = springIn(frame, appear);
  const outProgress = springIn(frame, leave);
  if (frame < appear || inProgress <= 0.001) return null;

  const alpha = Math.min(inProgress, 1) * (1 - outProgress);
  const scale = 0.8 + Math.min(inProgress, 1) * 0.2;
  const slide = (1 - Math.min(inProgress, 1)) * 24;
  const delta = TRACKS[track](frame);
  const live = anchors.map((a) => ({x: a.x + delta[0], y: a.y + delta[1], r: a.r}));

  const edgePoint = (a: {x: number; y: number}): Pt => {
    const cx = card.x + card.w / 2;
    const cy = card.y + card.h / 2;
    const dx = a.x - cx;
    const dy = a.y - cy;
    const scaleX = card.w / 2 / Math.max(Math.abs(dx), 0.001);
    const scaleY = card.h / 2 / Math.max(Math.abs(dy), 0.001);
    const t = Math.min(scaleX, scaleY, 1);
    return [cx + dx * t, cy + dy * t];
  };

  return (
    <div style={{position: 'absolute', inset: 0, opacity: alpha, pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {live.map((a, i) => {
          const e = edgePoint(a);
          const length = Math.hypot(a.x - e[0], a.y - e[1]);
          if (length < 1) return null;
          const grow = inProgress * length;
          return (
            <line
              key={i}
              x1={e[0]}
              y1={e[1]}
              x2={e[0] + ((a.x - e[0]) * grow) / length}
              y2={e[1] + ((a.y - e[1]) * grow) / length}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="3 3"
              opacity={0.85}
            />
          );
        })}
      </svg>

      {live.map((a, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: a.x - a.r,
            top: a.y - a.r,
            width: a.r * 2,
            height: a.r * 2,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            boxShadow: `0 0 ${16 + Math.sin(frame * 0.25) * 6}px ${color}66, inset 0 0 ${10 + Math.sin(frame * 0.25) * 4}px ${color}33`,
            transform: `scale(${0.9 + Math.sin(frame * 0.18) * 0.06})`,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          background: 'rgba(10,14,28,0.92)',
          border: `1px solid ${color}55`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: `translateY(${slide}px) scale(${scale})`,
          boxShadow: `0 10px 34px rgba(0,0,0,0.5), 0 0 24px ${color}22`,
        }}
      >
        <div style={{color, fontSize: 15, fontWeight: 800, letterSpacing: 1, marginBottom: 5}}>{title}</div>
        <div style={{color: '#C6D3E2', fontSize: 13, lineHeight: 1.45}}>{text}</div>
      </div>
    </div>
  );
};
