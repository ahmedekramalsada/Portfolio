/**
 * InstructorVideo.tsx
 * ------------------------------------------------------------------
 * Script-driven instructor video. Each script line is a scene where the
 * instructor appears at a given size/position/expression, a speech bubble
 * types out the line, and a subtitle bar shows the same text.
 */
import {useCurrentFrame, interpolate} from 'remotion';
import {InstructorRobot, type Expression} from './InstructorRobot';
import {SpeechBubble} from './SpeechBubble';
import {Subtitle} from './Subtitle';

export type Scene = {
  say: string;
  expression?: Expression;
  size?: number; // px wide
  x?: number; // center x on 720-wide canvas
  y?: number; // center y on 1280-high canvas
};

export const sceneFrames = (s: Scene): number =>
  Math.max(60, s.say.split(/\s+/).length * 12); // ~2.5 words/sec at 30fps, min 2s

const W = 720;
const H = 1280;

export const InstructorVideo: React.FC<{script: Scene[]}> = ({script}) => {
  const frame = useCurrentFrame();

  let acc = 0;
  const scenes = script.map((s) => {
    const duration = sceneFrames(s);
    const out = {start: acc, duration, scene: s};
    acc += duration;
    return out;
  });
  const total = acc;

  const active = scenes.find((s) => frame >= s.start && frame < s.start + s.duration);
  if (!active) return null;

  const prev = scenes[scenes.indexOf(active) - 1];
  const local = frame - active.start;
  const s = active.scene;

  // smooth 12-frame glide from previous scene's placement to this one's
  const blend = prev
    ? interpolate(local, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const px = prev ? lerp(prev.scene.x ?? 340, s.x ?? 340, blend) : s.x ?? 340;
  const py = prev ? lerp(prev.scene.y ?? 480, s.y ?? 480, blend) : s.y ?? 480;
  const sz = prev ? lerp(prev.scene.size ?? 340, s.size ?? 340, blend) : s.size ?? 340;

  const expression: Expression = s.expression ?? (local > 10 && active.duration > 90 ? 'talking' : 'neutral');

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #10142B 0%, #070A17 60%, #04060E 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#FFFFFF',
      }}
    >
      {/* grid backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(84,224,239,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(84,224,239,0.045) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      <InstructorRobot expression={expression} size={sz} x={px} y={py} speaking />

      <SpeechBubble text={s.say} x={px + (s.x ?? 340) * 0.28} y={py - sz * 0.62} frameOffset={active.start} maxWidth={300} />

      <Subtitle text={s.say} opacity={interpolate(local, [0, 8], [0, 1], {extrapolateRight: 'clamp'})} />
    </div>
  );
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** A sample script showing off every expression, size and position. */
export const SAMPLE_SCRIPT: Scene[] = [
  {say: 'Hi! I\'m your AI instructor.', expression: 'happy', size: 360, x: 180, y: 560},
  {say: 'I can be big when I explain,', expression: 'talking', size: 420, x: 520, y: 560},
  {say: 'or small while I point at a slide.', expression: 'neutral', size: 170, x: 150, y: 900},
  {say: 'Let me think about that...', expression: 'thinking', size: 220, x: 560, y: 300},
  {say: 'Great question! Here\'s the answer!', expression: 'excited', size: 400, x: 360, y: 580},
  {say: 'Watch this, it\'s important!', expression: 'alert', size: 260, x: 540, y: 820},
];

/** Total frames of the sample script. */
export const SAMPLE_SCRIPT_DURATION = SAMPLE_SCRIPT.reduce((acc, s) => acc + sceneFrames(s), 0);

/** Named composition component for the InstructorDemo registration. */
export const InstructorDemo: React.FC = () => <InstructorVideo script={SAMPLE_SCRIPT} />;
