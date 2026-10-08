/**
 * RobotTerminalDemo.tsx
 * ------------------------------------------------------------------
 * Test video: small robot instructor + mac terminal together.
 * The robot stands bottom-right on its glow pad, talking, while the
 * terminal types out the deploy script above it.
 */
import {useCurrentFrame, interpolate} from 'remotion';
import {MacTerminal, type CodeLine} from './MacTerminal';
import {InstructorRobot} from './InstructorRobot';
import {SpeechBubble} from './SpeechBubble';
import {StageBackground, GlowPad} from './SampleStage';

const CODE: CodeLine[] = [
  {text: 'cat deploy.ts', shell: true},
  {text: '// deploy check'},
  {text: "import { execSync } from 'child_process';"},
  {text: ''},
  {text: "const branch = 'main';"},
  {text: 'const sha = execSync(`git rev-parse --short HEAD`);'},
  {text: 'console.log(`deploying ${branch}@${sha}`);'},
  {text: ''},
  {text: "await deploy({ target: 'production' });"},
  {text: "console.log('live in 40s, zero downtime');"},
];

const TOTAL_CHARS = CODE.reduce((a, l) => a + l.text.length + (l.shell ? 2 : 0), 0);
export const ROBOT_TERMINAL_DURATION = Math.ceil(TOTAL_CHARS / 2) + 150;

const ROBOT_X = 545;
const ROBOT_Y = 1060;
const ROBOT_SIZE = 190;

export const RobotTerminalDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const robotIn = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = (1 - robotIn) * 70;

  return (
    <div
      style={{
        width: 720,
        height: 1280,
        position: 'relative',
        overflow: 'hidden',
        background: '#050505',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <StageBackground />

      <MacTerminal title="ahmed — zsh" code={CODE} x={360} y={470} width={640} frameOffset={10} />

      {/* small instructor, bottom-right */}
      <div style={{opacity: robotIn, transform: `translateX(${slide}px)`}}>
        <GlowPad x={ROBOT_X} y={1170} w={110} />
        <InstructorRobot expression="talking" size={ROBOT_SIZE} x={ROBOT_X} y={ROBOT_Y} speaking />
      </div>

      <SpeechBubble
        text="This script ships our app — watch each line."
        x={400}
        y={830}
        frameOffset={50}
        maxWidth={270}
      />
    </div>
  );
};
