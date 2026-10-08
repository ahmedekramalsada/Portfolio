/**
 * InstructorRobot.tsx
 * ------------------------------------------------------------------
 * The reusable instructor character — built to feel alive, not loopy:
 *
 *  - Continuous idle (layered non-repeating frequencies, global frame
 *    so motion never restarts on scene cuts)
 *  - `face` leans the robot toward the content it presents
 *  - `beats` trigger gestures (nod/hop/lean/tilt/shake) at exact frames
 *  - `moods` shift expression mid-scene with a crossfade
 *  - `playbackRate` desyncs the inner Lottie loop per scene
 */
import {useCurrentFrame, interpolate} from 'remotion';
import {Lottie} from '@remotion/lottie';
import robotData from '../ai-robot.json';
import {applyTheme, type LottieJSON} from '../aiRobotCustomize';

export type Expression = 'neutral' | 'happy' | 'thinking' | 'talking' | 'excited' | 'alert';

const ROBOT = robotData as unknown as LottieJSON;

const EXPRESSION_THEMES: Record<Expression, LottieJSON> = {
  neutral: ROBOT,
  happy: applyTheme(ROBOT, 'matrix'),
  thinking: applyTheme(ROBOT, 'sunset'),
  talking: applyTheme(ROBOT, 'ocean'),
  excited: applyTheme(ROBOT, 'gold'),
  alert: applyTheme(ROBOT, 'cyber'),
};

export type BeatKind = 'nod' | 'hop' | 'leanL' | 'leanR' | 'tilt' | 'shake';
export type Beat = {at: number; kind: BeatKind};
export type MoodShift = {at: number; expression: Expression};

/**
 * Movement direction — each scene gets its own signature so the robot
 * never repeats the same motion everywhere:
 *  float    - calm hover (default)
 *  pace     - teacher pacing side to side, leaning into each step
 *  presentL - leaning toward content on its left + slow presenting dips
 *  presentR - leaning toward content on its right + slow presenting dips
 *  hoppy    - occasional joyful hops
 *  thinker  - slow ponderous sway + occasional deep nod
 */
export type Motion = 'float' | 'pace' | 'presentL' | 'presentR' | 'hoppy' | 'thinker';

export const InstructorRobot: React.FC<{
  expression?: Expression;
  size?: number; // width in px
  x?: number; // center x on the canvas
  y?: number; // center y on the canvas
  speaking?: boolean;
  frameSeed?: number; // offsets idle + Lottie phase
  face?: 'left' | 'right' | 'center'; // lean toward presented content
  playbackRate?: number; // desync the inner loop (0.9 - 1.15)
  motion?: Motion; // per-scene movement signature
  beats?: Beat[]; // gestures on the LOCAL timeline
  moods?: MoodShift[]; // expression shifts on the LOCAL timeline
  timeline?: number; // local frame driving beats/moods (defaults to global)
}> = ({
  expression = 'neutral',
  size = 340,
  x = 340,
  y = 480,
  speaking = false,
  frameSeed = 0,
  face = 'center',
  playbackRate = 1,
  motion = 'float',
  beats = [],
  moods = [],
  timeline,
}) => {
  const gframe = useCurrentFrame() + frameSeed;
  const t = timeline ?? gframe;
  const height = size * (ROBOT.h / ROBOT.w);

  // ---- expression with mid-scene mood shifts (crossfade 14f) ----
  const shifts = [...moods].sort((a, b) => a.at - b.at);
  let current = expression;
  let prev: Expression | undefined;
  let blend = 1;
  for (const s of shifts) {
    if (t >= s.at) {
      prev = current;
      current = s.expression;
      blend = interpolate(t, [s.at, s.at + 14], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }

  // ---- continuous idle: slow, calm, never visibly repeats ----
  // All frequencies are slow (periods of 4-20s). Nothing above ~0.1.
  const seed = frameSeed * 0.37;
  const breathY = Math.sin(gframe * 0.045 + seed) * 3;
  const swayX = Math.sin(gframe * 0.021 + seed * 1.7) * 2.5;
  const swayR = Math.sin(gframe * 0.026 + seed * 2.3) * 1.2;

  // ---- expression motion (slow and subtle) ----
  let ey = 0;
  let er = 0;
  let es = 1;
  let ex = 0;
  switch (current) {
    case 'happy':
      ey = -Math.abs(Math.sin(t * 0.07)) * 10;
      break;
    case 'excited':
      ey = -Math.abs(Math.sin(t * 0.09)) * 14;
      es = 1 + Math.sin(t * 0.09) * 0.02;
      break;
    case 'thinking':
      er = Math.sin(t * 0.03) * 3;
      ex = Math.sin(t * 0.023 + 1) * 3;
      break;
    case 'talking':
      ey = -Math.abs(Math.sin(t * 0.11)) * (speaking ? 4 : 1.5);
      break;
    case 'alert':
      ex = Math.sin(t * 0.08) * 2;
      er = Math.sin(t * 0.06 + 0.7) * 1.5;
      break;
    default:
      ey = Math.sin(t * 0.04) * 4;
  }

  // ---- gesture beats (0 -> 1 -> 0 envelope, slow ease) ----
  let gx = 0;
  let gy = 0;
  let gr = 0;
  for (const b of beats) {
    const dur = 44;
    const d = t - b.at;
    if (d < 0 || d > dur) continue;
    const k = Math.sin((d / dur) * Math.PI);
    const e = k * k * (3 - 2 * k); // smoothstep: gentle in/out, no snap
    switch (b.kind) {
      case 'nod':
        gy += e * 7;
        break;
      case 'hop':
        gy += -e * 18;
        break;
      case 'leanL':
        gx += -e * 14;
        gr += -e * 3;
        break;
      case 'leanR':
        gx += e * 14;
        gr += e * 3;
        break;
      case 'tilt':
        gr += e * 6;
        break;
      case 'shake':
        gx += Math.sin(d * 0.35) * 3 * (1 - d / dur);
        break;
    }
  }

  // ---- face the content ----
  let fx = 0;
  let fr = 0;
  if (face === 'left') {
    fx = -12;
    fr = -3;
  } else if (face === 'right') {
    fx = 12;
    fr = 3;
  }

  // ---- per-scene movement signature (this is what kills the loop feel) ----
  let mx = 0;
  let my = 0;
  let mr = 0;
  let ms = 1;
  switch (motion) {
    case 'pace':
      // teacher pacing: slow ±40px wander, leaning into each step (~7s period)
      mx = Math.sin(t * 0.03 + seed) * 40;
      mr = Math.cos(t * 0.03 + seed) * 4;
      break;
    case 'presentL':
      mx = -10 + Math.sin(t * 0.05) * 3;
      mr = -2.5;
      my = -Math.pow(Math.max(0, Math.sin(t * 0.09)), 6) * 5;
      break;
    case 'presentR':
      mx = 10 + Math.sin(t * 0.05 + 1) * 3;
      mr = 2.5;
      my = -Math.pow(Math.max(0, Math.sin(t * 0.09 + 2)), 6) * 5;
      break;
    case 'hoppy': {
      const k = Math.pow(Math.max(0, Math.sin(t * 0.05 + seed)), 8);
      my = -k * 22;
      ms = 1 + k * 0.03;
      break;
    }
    case 'thinker': {
      mr = Math.sin(t * 0.028) * 4;
      mx = Math.sin(t * 0.02 + 1) * 5;
      const k = Math.pow(Math.max(0, Math.sin(t * 0.04 + 2)), 6);
      my = k * 6;
      break;
    }
    default:
      break;
  }

  const transform =
    `translate(${swayX + ex + gx + fx + mx}px, ${breathY + ey + gy + my}px) ` +
    `rotate(${swayR + er + gr + fr + mr}deg) scale(${es * ms})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - height / 2,
        width: size,
        height,
        filter: 'drop-shadow(0 0 30px rgba(84,224,239,0.12))',
      }}
    >
      <div style={{width: '100%', height: '100%', transform}}>
        <Lottie
          animationData={EXPRESSION_THEMES[current]}
          loop
          playbackRate={playbackRate}
          style={{width: '100%', height: '100%'}}
        />
        {prev && blend < 1 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - blend}}>
            <Lottie
              animationData={EXPRESSION_THEMES[prev]}
              loop
              playbackRate={playbackRate}
              style={{width: '100%', height: '100%'}}
            />
          </div>
        )}
      </div>
    </div>
  );
};
