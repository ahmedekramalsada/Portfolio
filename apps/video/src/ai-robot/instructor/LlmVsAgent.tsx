/**
 * LlmVsAgent.tsx
 * ------------------------------------------------------------------
 * Full explainer video (~2 min): "What is the difference between
 * an LLM and an AI Agent?"
 *
 * Every scene is alive: typewriter subtitles, staggered rows, camera
 * punch-ins, per-scene glow tones, and a robot that reacts to the
 * slide (gesture beats + mid-scene expression shifts).
 */
import {useCurrentFrame, interpolate} from 'remotion';
import {InstructorRobot, type Expression, type Beat, type MoodShift, type Motion} from './InstructorRobot';
import {TypewriterSubtitle} from './Subtitle';
import {SpeechBubble} from './SpeechBubble';
import {MacTerminal, type CodeLine} from './MacTerminal';
import {
  SceneBackdrop,
  type BackdropKind,
  GlowPad,
  PipelinePanel,
  BigTitle,
  CaptionChip,
  STAGE,
} from './SampleStage';

const W = 720;
const H = 1280;

/* ---------------------------------------------------------------- */
/* small building blocks                                            */
/* ---------------------------------------------------------------- */

const Panel: React.FC<{title: string; children: React.ReactNode; top?: number}> = ({
  title,
  children,
  top = 420,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      top,
      background: 'rgba(11,14,19,0.94)',
      border: '1px solid #2c313a',
      borderRadius: 16,
      padding: '20px 22px',
    }}
  >
    <div
      style={{
        color: STAGE.green,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 3,
        marginBottom: 14,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

/** Panel row that slides in at its staggered slot. */
const R: React.FC<{local: number; i: number; children: React.ReactNode}> = ({local, i, children}) => {
  const p = interpolate(local, [10 + i * 16, 24 + i * 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>{children}</div>
  );
};

const Row: React.FC<{left: string; right: string; leftColor?: string}> = ({
  left,
  right,
  leftColor = '#cfd6df',
}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c2027'}}>
    <span style={{color: leftColor, fontSize: 17, fontWeight: 700}}>{left}</span>
    <span style={{color: '#ffffff', fontSize: 17, textAlign: 'right', maxWidth: 330}}>{right}</span>
  </div>
);

const CompareTable: React.FC<{local: number}> = ({local}) => (
  <Panel title="LLM  vs  AI AGENT" top={400}>
    <div style={{display: 'flex', padding: '6px 0 10px'}}>
      <div style={{flex: 1}} />
      <div style={{flex: 1, color: STAGE.labelGray, fontSize: 15, fontWeight: 800, textAlign: 'right'}}>LLM</div>
      <div style={{flex: 1.4, color: STAGE.green, fontSize: 15, fontWeight: 800, textAlign: 'right'}}>AGENT</div>
    </div>
    {[
      ['Output', 'answers text', 'takes action'],
      ['Steps', 'one shot', 'perceive → act loop'],
      ['Tools', 'none', 'search · code · APIs'],
      ['Example', 'chatbot', 'assistant'],
    ].map(([k, a, b], i) => (
      <R key={k} local={local} i={i}>
        <div style={{display: 'flex', padding: '9px 0', borderBottom: '1px solid #1c2027'}}>
          <div style={{flex: 1, color: '#cfd6df', fontSize: 16, fontWeight: 700}}>{k}</div>
          <div style={{flex: 1, color: '#9aa4b2', fontSize: 15, textAlign: 'right'}}>{a}</div>
          <div style={{flex: 1.4, color: '#ffffff', fontSize: 15, fontWeight: 700, textAlign: 'right'}}>{b}</div>
        </div>
      </R>
    ))}
  </Panel>
);

type RobotProps = {
  expression: Expression;
  size: number;
  x: number;
  y: number;
  local: number;
  face?: 'left' | 'right' | 'center';
  rate?: number;
  beats?: Beat[];
  moods?: MoodShift[];
  seed?: number;
  motion?: Motion;
};

const MiniRobot: React.FC<RobotProps> = ({
  expression,
  size,
  x,
  y,
  local,
  face = 'center',
  rate = 1,
  beats = [],
  moods = [],
  seed = 0,
  motion = 'float',
}) => {
  const h = (size * 902) / 682;
  return (
    <div style={{position: 'absolute', left: 0, top: 0}}>
      <GlowPad x={x} y={y + h / 2 - 14} w={size * 0.42} />
      <InstructorRobot
        expression={expression}
        size={size}
        x={x}
        y={y}
        speaking
        face={face}
        playbackRate={rate}
        motion={motion}
        beats={beats}
        moods={moods}
        timeline={local}
        frameSeed={seed}
      />
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* script                                                            */
/* ---------------------------------------------------------------- */

export type Scene = {
  say: string;
  duration: number; // frames
  tone: string; // ambient glow accent
  backdrop: BackdropKind; // visibly different world per scene
  visual: (local: number) => React.ReactNode;
};

const LLM_CODE: CodeLine[] = [
  {text: 'ask("capital of France?")', shell: true},
  {text: '// one prompt in...'},
  {text: 'reply = llm.complete(prompt);'},
  {text: "print(reply);  // 'Paris'"},
  {text: '// ...one answer out. No tools.'},
];

const AGENT_CODE: CodeLine[] = [
  {text: 'agent.run("book morning flight")', shell: true},
  {text: 'THINK  need dates + budget...'},
  {text: "TOOL   search_flights({ to: 'DXB' })"},
  {text: 'OBS    3 options, cheapest 06:40'},
  {text: "TOOL   book_flight({ id: 'F-0640' })"},
  {text: 'DONE   booked! confirmation #A9182'},
];

const BLUE = '#4fa8ff';
const GREEN = '#46e046';
const PURPLE = '#b57bff';
const AMBER = '#ffb34d';
const RED = '#ff6b5e';

export const SCENES: Scene[] = [
  {
    say: 'LLM versus AI Agent — same brain, totally different power.',
    duration: 150,
    tone: GREEN,
    backdrop: 'neural',
    visual: (local) => (
      <>
        <BigTitle lines={['LLM vs', 'AI AGENT']} />
        <GlowPad x={360} y={1010} w={170} />
        <InstructorRobot
          expression="excited"
          size={330}
          x={360}
          y={800}
          speaking
          beats={[{at: 105, kind: 'hop'}]}
          motion="hoppy"
          timeline={local}
          frameSeed={3}
        />
        <SpeechBubble text="Same brain. Totally different power." x={360} y={420} frameOffset={30} maxWidth={330} />
      </>
    ),
  },
  {
    say: 'A large language model does one thing brilliantly. It predicts the next word. You prompt, it completes — using only what it learned in training.',
    duration: 270,
    tone: BLUE,
    backdrop: 'neural',
    visual: (local) => (
      <>
        <BigTitle lines={['THE BRAIN']} />
        <MiniRobot expression="neutral" size={220} x={180} y={880} local={local} face="right" rate={0.92} motion="thinker" moods={[{at: 40, expression: 'thinking'}]} beats={[{at: 120, kind: 'nod'}]} seed={7} />
        <Panel title="LLM = NEXT-WORD PREDICTOR" top={470}>
          <R local={local} i={0}><Row left="Input" right="your prompt" /></R>
          <R local={local} i={1}><Row left="Output" right="most likely text" /></R>
          <R local={local} i={2}><Row left="Knowledge" right="frozen at training" /></R>
        </Panel>
      </>
    ),
  },
  {
    say: 'Watch: one prompt in, one answer out. No tools, no actions, no memory of you.',
    duration: 300,
    tone: BLUE,
    backdrop: 'code',
    visual: (local) => (
      <>
        <MacTerminal title="llm — python" code={LLM_CODE} x={360} y={560} width={620} />
        <MiniRobot expression="talking" size={170} x={540} y={1060} local={local} face="left" rate={1.08} motion="presentL" beats={[{at: 100, kind: 'nod'}]} seed={11} />
      </>
    ),
  },
  {
    say: "But ask it for today's weather — it guesses. It cannot browse, cannot run code, cannot book anything. Smart, but stuck.",
    duration: 210,
    tone: AMBER,
    backdrop: 'alert',
    visual: (local) => (
      <>
        <BigTitle lines={['SMART,', 'BUT STUCK']} />
        <MiniRobot expression="neutral" size={200} x={360} y={880} local={local} rate={1.1} motion="thinker" moods={[{at: 55, expression: 'alert'}]} beats={[{at: 60, kind: 'shake'}, {at: 130, kind: 'tilt'}]} seed={5} />
      </>
    ),
  },
  {
    say: 'An AI agent is that same brain — with hands. An LLM that can use tools, remember context, and work in a loop.',
    duration: 240,
    tone: GREEN,
    backdrop: 'neural',
    visual: (local) => (
      <>
        <BigTitle lines={['BRAIN', '+ HANDS']} />
        <GlowPad x={360} y={1010} w={170} />
        <InstructorRobot
          expression="happy"
          size={330}
          x={360}
          y={800}
          speaking
          beats={[{at: 150, kind: 'hop'}, {at: 60, kind: 'leanL'}, {at: 100, kind: 'leanR'}]}
          motion="pace"
          timeline={local}
          frameSeed={9}
          playbackRate={1.05}
        />
      </>
    ),
  },
  {
    say: 'The loop is everything. Perceive the goal, plan a step, act with a tool, observe the result — and repeat until done.',
    duration: 300,
    tone: GREEN,
    backdrop: 'neural',
    visual: (local) => (
      <>
        <PipelinePanel
          steps={['GOAL', 'PLAN', 'TOOL', 'SEARCH', 'READ', 'CODE', 'CHECK', 'FIX', 'VERIFY', 'DONE']}
        />
        <MiniRobot expression="talking" size={190} x={180} y={900} local={local} face="right" rate={0.95} motion="presentR" beats={[{at: 40, kind: 'nod'}, {at: 120, kind: 'nod'}, {at: 200, kind: 'nod'}]} seed={13} />
        <Panel title="THE AGENT LOOP" top={880}>
          <R local={local} i={0}><Row left="1 · Perceive" right="read the goal" /></R>
          <R local={local} i={1}><Row left="2 · Plan" right="pick next step" /></R>
          <R local={local} i={2}><Row left="3 · Act" right="call a tool" /></R>
          <R local={local} i={3}><Row left="4 · Observe" right="read the result" /></R>
        </Panel>
      </>
    ),
  },
  {
    say: 'Watch an agent book a flight: it thinks, searches, compares, then acts — showing every step.',
    duration: 360,
    tone: GREEN,
    backdrop: 'code',
    visual: (local) => (
      <>
        <MacTerminal title="agent — run" code={AGENT_CODE} x={360} y={560} width={620} />
        <MiniRobot expression="talking" size={170} x={540} y={1060} local={local} face="left" rate={1.12} moods={[{at: 130, expression: 'excited'}]} beats={[{at: 135, kind: 'hop'}]} motion="hoppy" seed={17} />
      </>
    ),
  },
  {
    say: 'Tools are the hands: web search, code execution, calendars, APIs, databases. More tools, more capable agent.',
    duration: 240,
    tone: PURPLE,
    backdrop: 'code',
    visual: (local) => (
      <Panel title="THE HANDS = TOOLS" top={430}>
        <R local={local} i={0}><Row left="Search" right="live web facts" /></R>
        <R local={local} i={1}><Row left="Code" right="run + test programs" /></R>
        <R local={local} i={2}><Row left="Calendar" right="book + remind" /></R>
        <R local={local} i={3}><Row left="APIs + DBs" right="your company's data" /></R>
      </Panel>
    ),
  },
  {
    say: 'Agents remember two ways: short-term chat context, and long-term memory — notes and vector search across sessions.',
    duration: 240,
    tone: PURPLE,
    backdrop: 'clean',
    visual: (local) => (
      <>
        <Panel title="TWO MEMORIES" top={430}>
          <R local={local} i={0}><Row left="Short-term" right="this conversation" /></R>
          <R local={local} i={1}><Row left="Long-term" right="notes + vector search" /></R>
        </Panel>
        <MiniRobot expression="thinking" size={190} x={540} y={950} local={local} face="left" rate={0.9} motion="thinker" beats={[{at: 90, kind: 'tilt'}]} seed={19} />
      </>
    ),
  },
  {
    say: 'Side by side: the model answers, the agent acts. One shot versus a loop. No tools versus many. Chatbot versus assistant.',
    duration: 300,
    tone: PURPLE,
    backdrop: 'split',
    visual: (local) => (
      <>
        <CompareTable local={local} />
        <MiniRobot expression="neutral" size={160} x={540} y={1080} local={local} face="left" rate={1.05} motion="presentL" moods={[{at: 190, expression: 'happy'}]} beats={[{at: 60, kind: 'leanL'}, {at: 130, kind: 'leanL'}, {at: 200, kind: 'nod'}]} seed={23} />
      </>
    ),
  },
  {
    say: 'Writing help? An LLM is enough. Booking trips, fixing bugs, running workflows? You want the agent.',
    duration: 240,
    tone: GREEN,
    backdrop: 'clean',
    visual: (local) => (
      <Panel title="WHICH ONE WHEN?" top={430}>
        <R local={local} i={0}><Row left="Write / explain" right="LLM ✓" leftColor={STAGE.green} /></R>
        <R local={local} i={1}><Row left="Book / buy / fix" right="Agent ✓" leftColor={STAGE.green} /></R>
        <R local={local} i={2}><Row left="Run workflows" right="Agent ✓" leftColor={STAGE.green} /></R>
      </Panel>
    ),
  },
  {
    say: 'Two flavors: the support copilot that answers from your docs, and the coding agent that opens pull requests by itself.',
    duration: 240,
    tone: BLUE,
    backdrop: 'clean',
    visual: (local) => (
      <>
        <Panel title="TWO FLAVORS" top={430}>
          <R local={local} i={0}><Row left="Copilot" right="answers from docs" /></R>
          <R local={local} i={1}><Row left="Coding agent" right="opens PRs itself" /></R>
        </Panel>
        <MiniRobot expression="happy" size={190} x={540} y={950} local={local} face="left" rate={1.07} motion="pace" beats={[{at: 110, kind: 'hop'}]} seed={29} />
      </>
    ),
  },
  {
    say: 'Power needs guardrails: agents can loop forever, spend money, or break things — so we add approvals and limits.',
    duration: 240,
    tone: RED,
    backdrop: 'alert',
    visual: (local) => (
      <>
        <Panel title="GUARDRAILS" top={430}>
          <R local={local} i={0}><Row left="Risk" right="loops · cost · damage" leftColor="#ff7b72" /></R>
          <R local={local} i={1}><Row left="Fix" right="approvals + limits" leftColor={STAGE.green} /></R>
        </Panel>
        <MiniRobot expression="neutral" size={190} x={540} y={950} local={local} face="left" rate={1.1} motion="thinker" moods={[{at: 40, expression: 'alert'}]} beats={[{at: 45, kind: 'shake'}]} seed={31} />
      </>
    ),
  },
  {
    say: 'Remember three things: models predict, agents loop, tools make the difference.',
    duration: 210,
    tone: GREEN,
    backdrop: 'clean',
    visual: (local) => (
      <Panel title="RECAP" top={430}>
        <R local={local} i={0}><Row left="1 · Models" right="predict text" /></R>
        <R local={local} i={1}><Row left="2 · Agents" right="loop with tools" /></R>
        <R local={local} i={2}><Row left="3 · Tools" right="make the difference" /></R>
      </Panel>
    ),
  },
  {
    say: 'If this clicked, subscribe — next we build one from scratch.',
    duration: 240,
    tone: GREEN,
    backdrop: 'neural',
    visual: (local) => (
      <>
        <BigTitle lines={['NOW', 'YOU KNOW']} />
        <GlowPad x={360} y={1010} w={170} />
        <InstructorRobot
          expression="excited"
          size={330}
          x={360}
          y={800}
          speaking
          beats={[{at: 70, kind: 'hop'}, {at: 150, kind: 'hop'}]}
          motion="hoppy"
          timeline={local}
          frameSeed={37}
          playbackRate={1.08}
        />
        <CaptionChip parts={[{text: 'subscribe'}, {text: 'for the build', dim: true}]} />
      </>
    ),
  },
];

export const LLM_VS_AGENT_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

export const LlmVsAgent: React.FC = () => {
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
  // camera punch-in: starts close, settles as the scene plays
  const zoom = interpolate(local, [0, Math.max(1, active.duration)], [1.05, 1.0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        background: '#050505',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
      }}
    >
      <div key={index} style={{position: 'absolute', inset: 0}}>
        <SceneBackdrop kind={active.backdrop} accent={active.tone} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: fade,
            transform: `scale(${zoom})`,
          }}
        >
          {active.visual(local)}
        </div>
      </div>
      <TypewriterSubtitle text={active.say} local={local} duration={active.duration} />
    </div>
  );
};
