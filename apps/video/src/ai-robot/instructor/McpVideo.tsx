/**
 * McpVideo.tsx
 * ------------------------------------------------------------------
 * "What is MCP?" — built like the reference reel: full-width title
 * cards on top (white, cyan accents on the punchline), dark code
 * body below, 3 chapters, 9:16 vertical, adam voiceover.
 */
import {useCurrentFrame, interpolate, Audio, Sequence, staticFile} from 'remotion';
import {InstructorRobot} from './InstructorRobot';
import {TypewriterSubtitle} from './Subtitle';
import {MacTerminal, type CodeLine} from './MacTerminal';
import {
  SceneBackdrop,
  GlowPad,
  PipelinePanel,
  BigTitle,
  STAGE,
} from './SampleStage';

const W = 720;
const H = 1280;

const CONFIG_CODE: CodeLine[] = [
  {text: 'cat agent-config.json', shell: true},
  {text: '{'},
  {text: '  "mcp": {'},
  {text: '    "jira": "mcp.atlassian.com/v2/mcp"'},
  {text: '  }'},
  {text: '}'},
  {text: '// one line. that is the whole setup.'},
];

type McpScene = {
  say: string;
  duration: number;
  audio: string;
  audioSec: number;
  visual: (local: number) => React.ReactNode;
};

const R: React.FC<{local: number; i: number; children: React.ReactNode}> = ({local, i, children}) => {
  const p = interpolate(local, [10 + i * 16, 24 + i * 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>{children}</div>;
};

const MenuRow: React.FC<{fn: string; desc: string}> = ({fn, desc}) => (
  <div style={{padding: '10px 0', borderBottom: '1px solid #1c2027'}}>
    <div style={{color: '#61afef', fontSize: 17, fontWeight: 800, fontFamily: 'ui-monospace, Menlo, monospace'}}>
      {fn}
    </div>
    <div style={{color: '#9aa4b2', fontSize: 14, marginTop: 3}}>{desc}</div>
  </div>
);

const SCENES: McpScene[] = [
  {
    say: 'What is MCP? How AI agents use Jira. MCP is a standard plug between AI apps and your tools. It takes one line in your agent config.',
    duration: 351,
    audio: 'voiceover/mcp-s1.mp3',
    audioSec: 10.175,
    visual: (local) => (
      <>
        <BigTitle lines={['WHAT IS', 'MCP?']} />
        <MacTerminal title="agent-config.json" code={CONFIG_CODE} x={360} y={640} width={620} />
        <GlowPad x={540} y={1150} w={72} />
        <InstructorRobot
          expression="talking" size={170} x={540} y={1060} speaking face="left"
          motion="presentL" playbackRate={1.08}
          beats={[{at: 120, kind: 'nod'}]}
          timeline={local} frameSeed={21}
        />
      </>
    ),
  },
  {
    say: 'On connect, the agent asks the server what it can do — and gets a menu. You ask. The model picks a tool and fills in the parameters.',
    duration: 292,
    audio: 'voiceover/mcp-s2.mp3',
    audioSec: 8.225,
    visual: (local) => (
      <>
        <PipelinePanel steps={['CONFIG', 'MENU', 'ASK', 'PICK', 'FILL', 'CALL', 'RESULT', 'REPLY']} />
        <div
          style={{
            position: 'absolute', left: 60, right: 60, top: 430,
            background: 'rgba(11,14,19,0.94)', border: '1px solid #2c313a',
            borderRadius: 16, padding: '20px 22px',
          }}
        >
          <div style={{color: STAGE.green, fontSize: 13, fontWeight: 800, letterSpacing: 3, marginBottom: 10}}>
            THE TOOL MENU
          </div>
          <R local={local} i={0}><MenuRow fn="createJiraIssue" desc="open a ticket with fields" /></R>
          <R local={local} i={1}><MenuRow fn="searchJiraIssuesUsingJql" desc="find tickets with JQL" /></R>
          <R local={local} i={2}><MenuRow fn="getJiraIssue" desc="read one ticket fully" /></R>
        </div>
        <GlowPad x={180} y={1120} w={80} />
        <InstructorRobot
          expression="talking" size={175} x={180} y={1030} speaking face="right"
          motion="presentR" playbackRate={0.95}
          beats={[{at: 60, kind: 'nod'}, {at: 150, kind: 'nod'}]}
          timeline={local} frameSeed={33}
        />
      </>
    ),
  },
  {
    say: 'The server is just code. It calls Jira with your permissions and sends the result back. The model never touches Jira itself — and never holds your token.',
    duration: 339,
    audio: 'voiceover/mcp-s3.mp3',
    audioSec: 9.775,
    visual: (local) => (
      <>
        <BigTitle
          lines={['THE MODEL', {text: 'NEVER TOUCHES JIRA', accent: 'NEVER'}]}
        />
        <div
          style={{
            position: 'absolute', left: 60, right: 60, top: 470,
            background: 'rgba(11,14,19,0.94)', border: '1px solid #2c313a',
            borderRadius: 16, padding: '20px 22px',
          }}
        >
          <div style={{color: STAGE.green, fontSize: 13, fontWeight: 800, letterSpacing: 3, marginBottom: 10}}>
            WHO HOLDS WHAT
          </div>
          <R local={local} i={0}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c2027'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>Model sees</span><span style={{color: '#fff', fontSize: 17}}>menu + results</span></div></R>
          <R local={local} i={1}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c2027'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>Server holds</span><span style={{color: '#fff', fontSize: 17}}>your token</span></div></R>
          <R local={local} i={2}><div style={{display: 'flex', justifyContent: 'space-between', padding: '9px 0'}}><span style={{color: '#cfd6df', fontSize: 17, fontWeight: 700}}>You keep</span><span style={{color: '#54E0EF', fontSize: 17, fontWeight: 800}}>full control</span></div></R>
        </div>
        <GlowPad x={360} y={1120} w={95} />
        <InstructorRobot
          expression="happy" size={200} x={360} y={1010} speaking
          motion="hoppy" playbackRate={1.05}
          beats={[{at: 90, kind: 'hop'}]}
          timeline={local} frameSeed={41}
        />
      </>
    ),
  },
];

export const MCP_DURATION = SCENES.reduce((a, s) => a + s.duration, 0);

export const McpVideo: React.FC = () => {
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
  const tones = ['#4fa8ff', '#46e046', '#54E0EF'];
  const kinds = ['code', 'neural', 'neural'] as const;

  return (
    <div
      style={{
        width: W, height: H, position: 'relative', overflow: 'hidden',
        background: '#050505', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#fff',
      }}
    >
      <div key={index} style={{position: 'absolute', inset: 0}}>
        <SceneBackdrop kind={kinds[index]} accent={tones[index]} />
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
