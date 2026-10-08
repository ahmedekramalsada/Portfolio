/**
 * MacTerminalTest.tsx
 * ------------------------------------------------------------------
 * Test video: a macOS terminal window typing out a deploy script.
 */
import {MacTerminal, type CodeLine} from './MacTerminal';
import {StageBackground} from './SampleStage';

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
export const MAC_TERMINAL_TEST_DURATION = Math.ceil(TOTAL_CHARS / 2) + 90;

export const MacTerminalTest: React.FC = () => (
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
    <MacTerminal title="ahmed — zsh" code={CODE} x={360} y={600} width={620} />
  </div>
);
