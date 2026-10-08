/**
 * OneMinuteTest.tsx
 * ------------------------------------------------------------------
 * 1-minute test: first 6 scenes of the LLM-vs-Agent lesson with
 * warm+excited aiden voiceover. Reuses SCENES visuals directly —
 * single source of truth, audio fitted per scene.
 *
 * Durations are filled from measured MP3 lengths + 1.5s tail.
 */
import {useCurrentFrame, interpolate, Audio, Sequence, staticFile} from 'remotion';
import {SCENES, type Scene} from './LlmVsAgent';
import {TypewriterSubtitle} from './Subtitle';
import {SceneBackdrop} from './SampleStage';

const W = 720;
const H = 1280;

// measured min1-sN.mp3 lengths (sec) + 45f tail — S6 locked standard
const AUDIO_SEC = [4.875, 8.825, 5.426, 7.45, 7.55, 7.175];
const TAIL = 45;

type VoScene = Scene & {audio: string; audioSec: number};

const build = (): VoScene[] =>
  SCENES.slice(0, 6).map((s, i) => ({
    ...s,
    duration: Math.ceil(AUDIO_SEC[i] * 30) + TAIL,
    audio: `voiceover/adam-s${i + 1}.mp3`,
    audioSec: AUDIO_SEC[i],
  }));

export const ONE_MINUTE_DURATION = build().reduce((a, s) => a + s.duration, 0);

export const OneMinuteTest: React.FC = () => {
  const scenes = build();
  const frame = useCurrentFrame();
  let acc = 0;
  let index = 0;
  let active = scenes[0];
  let start = 0;
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    if (frame >= acc && frame < acc + s.duration) {
      active = s;
      start = acc;
      index = i;
      break;
    }
    acc += s.duration;
  }
  const local = frame - start;
  const fade = interpolate(local, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const zoom = interpolate(local, [0, Math.max(1, active.duration)], [1.05, 1.0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: W, height: H, position: 'relative', overflow: 'hidden',
        background: '#050505', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#fff',
      }}
    >
      <div key={index} style={{position: 'absolute', inset: 0}}>
        <SceneBackdrop kind={active.backdrop} accent={active.tone} />
        <div style={{position: 'absolute', inset: 0, opacity: fade, transform: `scale(${zoom})`}}>
          {active.visual(local)}
        </div>
      </div>
      <Sequence from={start} durationInFrames={active.duration} layout="none" name={active.audio}>
        <Audio src={staticFile(active.audio)} />
      </Sequence>
      <TypewriterSubtitle text={active.say} local={local} duration={active.duration} />
    </div>
  );
};
