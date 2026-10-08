/**
 * VoiceoverTest.tsx
 * ------------------------------------------------------------------
 * ENERGY test: excited vivian voiceover + karaoke subtitles +
 * punch-words with bursts + synthesized SFX (pop/whoosh/ding).
 *
 *  hot s1: 7.04s -> 257f | s2: 9.76s -> 338f | s3: 7.12s -> 259f
 *  total: 854f (~28.5s)
 *  punch globals: s1=190, s2=362, s3=695 | ding at 824
 */
import {useCurrentFrame, interpolate, Audio, Sequence, staticFile, spring} from 'remotion';
import {InstructorRobot} from './InstructorRobot';
import {KaraokeSubtitle} from './Subtitle';
import {SpeechBubble} from './SpeechBubble';
import {MacTerminal, type CodeLine} from './MacTerminal';
import {SceneBackdrop, GlowPad, BigTitle, Burst, STAGE} from './SampleStage';

const W = 720;
const H = 1280;

const CODE: CodeLine[] = [
  {text: 'ask("capital of France?")', shell: true},
  {text: '// one prompt in...'},
  {text: 'reply = llm.complete(prompt);'},
  {text: "print(reply);  // 'Paris'"},
  {text: '// ...one answer out. No tools.'},
];

type TestScene = {
  say: string;
  duration: number;
  audio: string;
  audioSec: number;
  punch?: {word: string; at: number; color: string};
  visual: (local: number) => React.ReactNode;
};

const R: React.FC<{local: number; i: number; children: React.ReactNode}> = ({local, i, children}) => {
  const p = interpolate(local, [10 + i * 16, 24 + i * 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>{children}</div>;
};

/** Full-screen punch word: slams in with spring, flashes, bursts. */
const Punch: React.FC<{word: string; at: number; local: number; color: string}> = ({
  word,
  at,
  local,
  color,
}) => {
  const d = local - at;
  if (d < 0 || d > 26) return null;
  const p = spring({frame: d, fps: 30, config: {damping: 11, stiffness: 220}});
  const flash = d < 4 ? 0.14 * (1 - d / 4) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: '#ffffff', opacity: flash}} />
      <Burst x={360} y={620} at={at} color={color} />
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center',
          opacity: Math.min(1, p),
          transform: `scale(${2.3 - p * 1.3}) rotate(${(1 - Math.min(1, p)) * -6}deg)`,
        }}
      >
        <span
          style={{
            fontSize: 110, fontWeight: 900, letterSpacing: 2, color: '#ffffff',
            textShadow: `0 0 40px ${color}, 0 6px 0 rgba(0,0,0,0.6)`,
            WebkitTextStroke: `3px ${color}`,
          }}
        >
          {word}
        </span>
      </div>
    </div>
  );
};

const SCENES: TestScene[] = [
  {
    say: 'LLM versus AI Agent — same brain, totally different power.',
    duration: 257,
    audio: 'voiceover/test-hot-s1.mp3',
    audioSec: 7.04,
    punch: {word: 'POWER', at: 190, color: '#ffd24d'},
    visual: (local) => (
      <>
        <BigTitle lines={['LLM vs', 'AI AGENT']} />
        <GlowPad x={360} y={1010} w={170} />
        <InstructorRobot
          expression="excited" size={330} x={360} y={800} speaking motion="hoppy"
          beats={[{at: 105, kind: 'hop'}, {at: 190, kind: 'hop'}]}
          timeline={local} frameSeed={3}
        />
        <SpeechBubble text="Same brain. Totally different power." x={360} y={420} frameOffset={30} maxWidth={330} />
      </>
    ),
  },
  {
    say: 'A large language model does one thing brilliantly. It predicts the next word. You prompt, it completes — using only what it learned in training.',
    duration: 338,
    audio: 'voiceover/test-hot-s2.mp3',
    audioSec: 9.76,
    punch: {word: 'PREDICTS', at: 105, color: '#96F5FF'},
    visual: (local) => (
      <>
        <BigTitle lines={['THE BRAIN']} />
        <GlowPad x={180} y={990} w={95} />
        <InstructorRobot
          expression="neutral" size={220} x={180} y={880} speaking face="right"
          motion="thinker" playbackRate={0.92}
          moods={[{at: 40, expression: 'thinking'}]}
          beats={[{at: 105, kind: 'nod'}, {at: 200, kind: 'nod'}]}
          timeline={local} frameSeed={7}
        />
        <div
          style={{
            position: 'absolute', left: 60, right: 60, top: 470,
            background: 'rgba(11,14,19,0.94)', border: '1px solid #2c313a',
            borderRadius: 16, padding: '20px 22px',
          }}
        >
          <div style={{color: STAGE.green, fontSize: 13, fontWeight: 800, letterSpacing: 3, marginBottom: 14}}>
            LLM = NEXT-WORD PREDICTOR
          </div>
          <R local={local} i={0}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c2027'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>Input</span><span style={{color: '#fff', fontSize: 17}}>your prompt</span></div></R>
          <R local={local} i={1}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c2027'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>Output</span><span style={{color: '#fff', fontSize: 17}}>most likely text</span></div></R>
          <R local={local} i={2}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>Knowledge</span><span style={{color: '#fff', fontSize: 17}}>frozen at training</span></div></R>
        </div>
      </>
    ),
  },
  {
    say: 'Watch: one prompt in, one answer out. No tools, no actions, no memory of you.',
    duration: 259,
    audio: 'voiceover/test-hot-s3.mp3',
    audioSec: 7.12,
    punch: {word: 'NO TOOLS', at: 100, color: '#46e046'},
    visual: (local) => (
      <>
        <MacTerminal title="llm — python" code={CODE} x={360} y={560} width={620} />
        <GlowPad x={540} y={1150} w={72} />
        <InstructorRobot
          expression="talking" size={170} x={540} y={1060} speaking face="left"
          motion="presentL" playbackRate={1.08}
          beats={[{at: 100, kind: 'nod'}]}
          timeline={local} frameSeed={11}
        />
      </>
    ),
  },
];

export const VOICEOVER_TEST_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

const SFX: Array<{file: string; at: number; volume: number}> = [
  {file: 'sfx/whoosh.wav', at: 0, volume: 0.5},
  {file: 'sfx/whoosh.wav', at: 257, volume: 0.5},
  {file: 'sfx/whoosh.wav', at: 595, volume: 0.5},
  {file: 'sfx/pop.wav', at: 190, volume: 0.7},
  {file: 'sfx/pop.wav', at: 362, volume: 0.7},
  {file: 'sfx/pop.wav', at: 695, volume: 0.7},
  {file: 'sfx/ding.wav', at: 824, volume: 0.6},
];

export const VoiceoverTest: React.FC = () => {
  const frame = useCurrentFrame();
  let acc = 0;
  let index = 0;
  let active = SCENES[0];
  let start = 0;
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i];
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
        <SceneBackdrop kind={index === 2 ? 'code' : 'neural'} accent={index === 2 ? '#4fa8ff' : '#46e046'} />
        <div style={{position: 'absolute', inset: 0, opacity: fade, transform: `scale(${zoom})`}}>
          {active.visual(local)}
        </div>
      </div>
      {active.punch && (
        <Punch word={active.punch.word} at={active.punch.at} local={local} color={active.punch.color} />
      )}
      <Sequence from={start} durationInFrames={active.duration} layout="none" name={active.audio}>
        <Audio src={staticFile(active.audio)} />
      </Sequence>
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none" name={s.file}>
          <Audio src={staticFile(s.file)} volume={s.volume} />
        </Sequence>
      ))}
      <KaraokeSubtitle text={active.say} local={local} audioSec={active.audioSec} />
    </div>
  );
};
