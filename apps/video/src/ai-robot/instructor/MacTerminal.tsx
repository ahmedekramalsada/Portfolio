/**
 * MacTerminal.tsx
 * ------------------------------------------------------------------
 * A macOS-style terminal window that types out code, for use as the
 * "teaching window" in instructor videos.
 *
 *  - Title bar with traffic lights (red/yellow/green) + title
 *  - OneDark-style syntax highlighting (keywords/strings/comments/
 *    numbers/function calls)
 *  - Typewriter reveal + blinking block cursor
 *  - Spring entrance (fade + rise + scale)
 */
import {useCurrentFrame, spring, interpolate} from 'remotion';

export type CodeLine = {text: string; shell?: boolean};

type Token = {text: string; kind: 'plain' | 'keyword' | 'string' | 'comment' | 'number' | 'fn' | 'prompt'};

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'import', 'from', 'export',
  'await', 'async', 'if', 'else', 'for', 'of', 'new', 'true', 'false', 'null',
]);

const TOKEN_RE =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|import|from|export|await|async|if|else|for|of|new|true|false|null)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;

/** Split one code line into colored tokens. */
export const tokenize = (line: string): Token[] => {
  const tokens: Token[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) {
      tokens.push({text: line.slice(last, m.index), kind: 'plain'});
    }
    if (m[1] !== undefined) tokens.push({text: m[1], kind: 'comment'});
    else if (m[2] !== undefined) tokens.push({text: m[2], kind: 'string'});
    else if (m[3] !== undefined) tokens.push({text: m[3], kind: 'keyword'});
    else if (m[4] !== undefined) tokens.push({text: m[4], kind: 'number'});
    else if (m[5] !== undefined) tokens.push({text: m[5], kind: 'fn'});
    last = m.index + m[0].length;
    if (m[0].length === 0) break;
  }
  if (last < line.length) {
    tokens.push({text: line.slice(last), kind: 'plain'});
  }
  return tokens.length > 0 ? tokens : [{text: line, kind: 'plain'}];
};

const TOKEN_COLORS: Record<Token['kind'], React.CSSProperties> = {
  plain: {color: '#abb2bf'},
  keyword: {color: '#c678dd'},
  string: {color: '#98c379'},
  comment: {color: '#5c6370', fontStyle: 'italic'},
  number: {color: '#d19a66'},
  fn: {color: '#61afef'},
  prompt: {color: '#98c379', fontWeight: 800},
};

export const MacTerminal: React.FC<{
  title?: string;
  code: CodeLine[];
  x?: number; // center x
  y?: number; // center y
  width?: number;
  charsPerFrame?: number;
  frameOffset?: number;
  holdFrames?: number;
}> = ({
  title = 'ahmed — zsh',
  code,
  x = 360,
  y = 640,
  width = 600,
  charsPerFrame = 2,
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame() - frameOffset;

  const enter = spring({frame, fps: 30, config: {damping: 16, stiffness: 120}});
  const rise = interpolate(frame, [0, 18], [26, 0], {extrapolateRight: 'clamp'});

  // total chars (shell prefix "$ " counts as 2)
  const lineLens = code.map((l) => l.text.length + (l.shell ? 2 : 0));
  const total = lineLens.reduce((a, b) => a + b, 0);
  const revealed = Math.min(total, Math.max(0, Math.floor(frame / 1) * charsPerFrame));
  const done = revealed >= total;
  const cursorOn = frame % 32 < 18;

  let budget = revealed;
  const rows: Array<{shell: boolean; tokens: Token[]; cursorAfter: number}> = [];
  code.forEach((line) => {
    const take = Math.min(line.text.length + (line.shell ? 2 : 0), budget);
    budget -= take;
    if (take <= 0) return;
    if (line.shell) {
      const promptTake = Math.min(2, take);
      const codeTake = take - promptTake;
      const tokens: Token[] = [];
      if (promptTake > 0) tokens.push({text: '$ '.slice(0, promptTake), kind: 'prompt'});
      if (codeTake > 0) {
        // plain white command text (no highlighting for shell cmds)
        tokens.push({text: line.text.slice(0, codeTake), kind: 'plain'});
      }
      rows.push({shell: true, tokens, cursorAfter: codeTake});
    } else {
      const slice = line.text.slice(0, take);
      const tokens = tokenize(line.text).reduce<Token[]>((acc, t) => {
        const used = acc.reduce((n, a) => n + a.text.length, 0);
        const remain = take - used;
        if (remain <= 0) return acc;
        acc.push({text: t.text.slice(0, remain), kind: t.kind});
        return acc;
      }, []);
      void slice;
      rows.push({shell: false, tokens, cursorAfter: take});
    }
  });

  const lineH = 30;
  const padTop = 52;
  const padSide = 22;
  const padBottom = 24;
  const height = padTop + code.length * lineH + padBottom;

  if (frame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        opacity: enter,
        transform: `translateY(${rise}px) scale(${0.94 + enter * 0.06})`,
        borderRadius: 14,
        overflow: 'hidden',
        background: '#0b0e13',
        border: '1px solid #232b38',
        boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 40px rgba(97,175,239,0.06)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: padTop,
          background: '#141922',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: 9,
          borderBottom: '1px solid #0a0d12',
        }}
      >
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#ff5f57'}} />
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#febc2e'}} />
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#28c840'}} />
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#9da5b4',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </div>
        <div style={{width: 57}} />
      </div>

      {/* code body */}
      <div style={{padding: `14px ${padSide}px 0`}}>
        {rows.map((row, i) => (
          <div key={i} style={{display: 'flex', height: lineH, alignItems: 'center'}}>
            <div
              style={{
                width: 30,
                color: '#39414f',
                fontSize: 15,
                textAlign: 'right',
                marginRight: 16,
                userSelect: 'none',
              }}
            >
              {i + 1}
            </div>
            <div style={{fontSize: 16.5, whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
              {row.tokens.map((t, j) => (
                <span key={j} style={TOKEN_COLORS[t.kind]}>
                  {t.text}
                </span>
              ))}
              {i === rows.length - 1 && !done && cursorOn && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 20,
                    background: '#528bff',
                    marginLeft: 2,
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {done && (
          <div style={{display: 'flex', height: lineH, alignItems: 'center'}}>
            <div style={{width: 30, marginRight: 16}} />
            <div style={{fontSize: 16.5, display: 'flex', alignItems: 'center'}}>
              {cursorOn && (
                <span style={{display: 'inline-block', width: 10, height: 20, background: '#528bff'}} />
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{height: padBottom}} />
    </div>
  );
};
