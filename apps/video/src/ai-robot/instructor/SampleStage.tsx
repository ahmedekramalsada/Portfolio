/**
 * SampleStage.tsx
 * ------------------------------------------------------------------
 * Recreates the sample video's visual language ("CI/CD Explained"):
 * black isometric datacenter, green pipeline accents, pipeline panel
 * on top, big white title, glowing pad under the instructor, dark
 * caption chip at the bottom.
 *
 * Measurements taken from the sample thumbnail (720x1280 vertical):
 *  - bg #050505, grid lines #1a1a1a
 *  - server bodies #17181d, tops #23242a, slats #b8c4cc
 *  - platform fill #0e0f12, stroke #3f4147
 *  - green path #4caf50, outline #46e046, pad #3ef03e
 *  - panel fill #0b0e13, border #2c313a, dots #35d435
 *  - labels #9aa4b2, CI/CD #cfd6df, title #ffffff
 *  - caption chip #141414 at 85%
 */
import {useCurrentFrame, interpolate, spring} from 'remotion';

export const STAGE = {
  bg: '#050505',
  grid: 'rgba(255,255,255,0.055)',
  platformFill: '#0e0f12',
  platformStroke: '#3f4147',
  serverBody: '#17181d',
  serverTop: '#23242a',
  serverSlat: '#b8c4cc',
  green: '#4caf50',
  greenBright: '#46e046',
  pad: '#3ef03e',
  panelFill: '#0b0e13',
  panelBorder: '#2c313a',
  dot: '#35d435',
  labelGray: '#9aa4b2',
  labelLight: '#cfd6df',
  chipFill: 'rgba(20,20,20,0.85)',
};

export const PIPELINE_STEPS = [
  'PUSH',
  'INSTALL',
  'LINT',
  'TEST',
  'BUILD',
  'SCAN',
  'IMAGE',
  'STAGING',
  'APPROVE',
  'PROD',
];

/** Dark datacenter backdrop: vignette + drifting perspective grid + dust. */
export const StageBackground: React.FC<{accent?: string}> = ({accent = STAGE.greenBright}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.55) % 52;
  const breathe = 0.05 + 0.022 * Math.sin(frame * 0.05);
  return (
    <div style={{position: 'absolute', inset: 0, background: STAGE.bg}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 38%, ${accent}14 0%, transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(20,24,32,0.9) 0%, transparent 70%)`,
          opacity: 0.6 + breathe * 8,
        }}
      />
      {/* perspective floor grid, slowly drifting down = camera feel */}
      <svg width={720} height={1280} style={{position: 'absolute', inset: 0, opacity: 0.9}}>
        {Array.from({length: 16}).map((_, i) => {
          const y = 520 + ((i * 52 + drift) % 832);
          return (
            <line
              key={`h${i}`}
              x1={-100}
              y1={y}
              x2={820}
              y2={y}
              stroke={STAGE.grid}
              strokeWidth={i % 3 === 0 ? 1.5 : 1}
            />
          );
        })}
        {Array.from({length: 13}).map((_, i) => {
          const x = 360 + (i - 6) * 90;
          return (
            <line
              key={`v${i}`}
              x1={360}
              y1={520}
              x2={x}
              y2={1280}
              stroke={STAGE.grid}
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <Dust accent={accent} />
    </div>
  );
};

/** Slow-rising dust motes — deterministic, no randomness per frame. */
const Dust: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const hash = (n: number): number => {
    const x = Math.sin(n * 127.1 + 11.7) * 43758.5;
    return x - Math.floor(x);
  };
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 26}).map((_, i) => {
        const x = hash(i) * 720;
        const speed = 0.4 + hash(i + 100) * 0.9;
        const y = ((hash(i + 200) * 1400 - frame * speed) % 1400 + 1400) % 1400 - 60;
        const s = 2 + hash(i + 300) * 2.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: i % 3 === 0 ? accent : '#ffffff',
              opacity: 0.1 + hash(i + 400) * 0.22,
            }}
          />
        );
      })}
    </div>
  );
};

export type BackdropKind = 'farm' | 'clean' | 'code' | 'alert' | 'split' | 'neural';

/** Faint falling code glyphs for `code` backdrops. */
const CodeRain: React.FC = () => {
  const frame = useCurrentFrame();
  const hash = (n: number): number => {
    const x = Math.sin(n * 311.7 + 7.3) * 27581.3;
    return x - Math.floor(x);
  };
  const glyphs = ['{', '}', ';', '(', ')', '=', '>', '/', '*', '#', '<', '+'];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
        overflow: 'hidden',
      }}
    >
      {Array.from({length: 12}).map((_, c) => {
        const x = 20 + c * 58 + hash(c) * 20;
        const speed = 0.7 + hash(c + 50) * 1.1;
        return (
          <div key={c} style={{position: 'absolute', left: x, top: 0}}>
            {Array.from({length: 9}).map((_, r) => {
              const y = ((hash(c * 10 + r) * 1500 - frame * speed) % 1500 + 1500) % 1500 - 110;
              return (
                <div
                  key={r}
                  style={{
                    position: 'absolute',
                    top: y,
                    left: 0,
                    color: '#4fa8ff',
                    opacity: 0.05 + hash(c + r) * 0.09,
                    fontSize: 22 + hash(r * 3 + c) * 10,
                  }}
                >
                  {glyphs[Math.floor(hash(c * 7 + r * 13) * glyphs.length)]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Neural-network backdrop — the topical world for brain/agent videos:
 * layered nodes with pulses traveling along the connections.
 */
const NeuralNet: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const hash = (n: number): number => {
    const x = Math.sin(n * 91.7 + 3.1) * 19373.7;
    return x - Math.floor(x);
  };
  const layers = [4, 6, 5];
  const xs = [140, 360, 580];
  const nodes: Array<{x: number; y: number; r: number}> = [];
  layers.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      const y = 330 + (i / Math.max(1, count - 1)) * 620 + (hash(li * 10 + i) - 0.5) * 40;
      nodes.push({x: xs[li] + (hash(li * 20 + i) - 0.5) * 24, y, r: 11 + hash(li * 30 + i) * 7});
    }
  });
  const byLayer: Array<typeof nodes> = [[], [], []];
  let k = 0;
  layers.forEach((count, li) => {
    for (let i = 0; i < count; i++) byLayer[li].push(nodes[k++]);
  });
  return (
    <svg width={720} height={1280} style={{position: 'absolute', inset: 0}}>
      {byLayer[0].flatMap((a, ai) =>
        byLayer[1].flatMap((b, bi) => {
          const pulse = Math.max(0, Math.sin(frame * 0.055 - (a.x + b.x) / 720 * 5 + ai + bi));
          return [
            <line
              key={`${ai}-${bi}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={accent}
              strokeWidth={1.4}
              opacity={0.05 + pulse * 0.1}
            />,
          ];
        })
      )}
      {byLayer[1].flatMap((a, ai) =>
        byLayer[2].map((b, bi) => {
          const pulse = Math.max(0, Math.sin(frame * 0.055 - (a.x + b.x) / 720 * 5 + ai + bi + 2));
          return (
            <line
              key={`1-${ai}-${bi}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={accent}
              strokeWidth={1.4}
              opacity={0.05 + pulse * 0.1}
            />
          );
        })
      )}
      {nodes.map((n, i) => {
        const bob = Math.sin(frame * 0.03 + i * 1.3) * 6;
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y + bob} r={n.r + 9} fill={accent} opacity={0.06} />
            <circle cx={n.x} cy={n.y + bob} r={n.r} fill="#0b0e13" stroke={accent} strokeWidth={1.6} opacity={0.75} />
            <circle cx={n.x} cy={n.y + bob} r={3.5} fill={accent} opacity={0.9} />
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Full per-scene backdrop. Kinds look genuinely different:
 *  farm   - server datacenter (the showcase world)
 *  clean  - empty gradient + grid, content pops
 *  code   - falling code glyphs (prediction / code scenes)
 *  alert  - red warning mood (stuck / risks)
 *  split  - blue left / purple right (versus scenes)
 *  neural - AI brain: layered nodes + traveling pulses (LLM/agent topics)
 */
export const SceneBackdrop: React.FC<{kind: BackdropKind; accent?: string}> = ({
  kind,
  accent = STAGE.greenBright,
}) => {
  const frame = useCurrentFrame();
  const alertPulse = 0.5 + 0.5 * Math.sin(frame * 0.06);
  return (
    <div style={{position: 'absolute', inset: 0, background: STAGE.bg}}>
      {kind === 'split' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 18% 40%, rgba(79,168,255,0.10) 0%, transparent 55%), radial-gradient(ellipse at 82% 40%, rgba(181,123,255,0.10) 0%, transparent 55%)',
          }}
        />
      ) : kind === 'alert' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, rgba(255,107,94,${0.1 + alertPulse * 0.06}) 0%, transparent 60%)`,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 38%, ${accent}14 0%, transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(20,24,32,0.9) 0%, transparent 70%)`,
          }}
        />
      )}
      {kind === 'alert' && (
        <svg width={720} height={1280} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
          {Array.from({length: 24}).map((_, i) => (
            <line
              key={i}
              x1={-200 + i * 60}
              y1={0}
              x2={-200 + i * 60 + 400}
              y2={1280}
              stroke="#ff6b5e"
              strokeWidth={10}
              opacity={0.035}
            />
          ))}
        </svg>
      )}
      {/* perspective floor grid, slowly drifting down = camera feel */}
      <svg width={720} height={1280} style={{position: 'absolute', inset: 0, opacity: 0.9}}>
        {Array.from({length: 16}).map((_, i) => {
          const drift = (frame * 0.55) % 52;
          const y = 520 + ((i * 52 + drift) % 832);
          return (
            <line
              key={`h${i}`}
              x1={-100}
              y1={y}
              x2={820}
              y2={y}
              stroke={kind === 'alert' ? 'rgba(255,107,94,0.10)' : STAGE.grid}
              strokeWidth={i % 3 === 0 ? 1.5 : 1}
            />
          );
        })}
        {Array.from({length: 13}).map((_, i) => {
          const x = 360 + (i - 6) * 90;
          return (
            <line
              key={`v${i}`}
              x1={360}
              y1={520}
              x2={x}
              y2={1280}
              stroke={kind === 'alert' ? 'rgba(255,107,94,0.10)' : STAGE.grid}
              strokeWidth={1}
            />
          );
        })}
      </svg>
      {kind === 'farm' && <ServerFarm />}
      {kind === 'code' && <CodeRain />}
      {kind === 'neural' && <NeuralNet accent={accent} />}
      {kind === 'split' && (
        <div
          style={{
            position: 'absolute',
            left: 359,
            top: 380,
            bottom: 120,
            width: 2,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.14), transparent)',
          }}
        />
      )}
      <Dust accent={kind === 'alert' ? '#ff6b5e' : accent} />
    </div>
  );
};

/** One isometric server rack: dark box + top face + vent slats. */
export const ServerRack: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  highlight?: boolean;
}> = ({x, y, w = 64, h = 96, highlight = false}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
    {/* top face (parallelogram) */}
    <div
      style={{
        position: 'absolute',
        left: 6,
        top: -14,
        width: w - 4,
        height: 28,
        background: STAGE.serverTop,
        transform: 'skewX(-45deg)',
        borderRadius: 3,
        border: highlight ? `1px solid ${STAGE.greenBright}` : '1px solid #2c2e35',
        boxShadow: highlight ? `0 0 18px ${STAGE.greenBright}66` : 'none',
      }}
    />
    {/* body */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        background: `linear-gradient(180deg, #1e1f25 0%, ${STAGE.serverBody} 30%)`,
        border: highlight ? `1px solid ${STAGE.greenBright}` : '1px solid #26282f',
        borderRadius: 4,
        boxShadow: highlight ? `0 0 22px ${STAGE.greenBright}55` : '0 8px 24px rgba(0,0,0,0.6)',
      }}
    />
    {/* vent slats */}
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 10,
          right: 10,
          top: 18 + i * 20,
          height: 5,
          borderRadius: 2,
          background: highlight && i === 1 ? '#3d7bfd' : STAGE.serverSlat,
          opacity: highlight && i === 1 ? 1 : 0.55,
          boxShadow: highlight && i === 1 ? '0 0 10px #3d7bfd' : 'none',
        }}
      />
    ))}
    {/* status LED */}
    <div
      style={{
        position: 'absolute',
        right: 8,
        top: 8,
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: highlight ? STAGE.greenBright : STAGE.green,
        boxShadow: `0 0 8px ${highlight ? STAGE.greenBright : STAGE.green}`,
      }}
    />
  </div>
);

/** A cluster of racks on one platform slab. */
export const ServerFarm: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    {/* back platform */}
    <div
      style={{
        position: 'absolute',
        left: 130,
        top: 470,
        width: 460,
        height: 150,
        background: STAGE.platformFill,
        border: `1px solid ${STAGE.platformStroke}`,
        transform: 'skewX(-18deg)',
        borderRadius: 8,
      }}
    />
    <ServerRack x={170} y={420} />
    <ServerRack x={245} y={405} h={110} />
    <ServerRack x={322} y={415} highlight />
    <ServerRack x={398} y={408} />
    <ServerRack x={472} y={422} w={56} h={88} />
    {/* front-right platform with green outline */}
    <div
      style={{
        position: 'absolute',
        left: 400,
        top: 880,
        width: 230,
        height: 120,
        background: STAGE.platformFill,
        border: `1.5px solid ${STAGE.greenBright}`,
        boxShadow: `0 0 24px ${STAGE.greenBright}33`,
        transform: 'skewX(-18deg)',
        borderRadius: 8,
      }}
    />
    <ServerRack x={450} y={850} w={56} h={88} />
    <ServerRack x={520} y={858} w={56} h={80} />
    {/* dashed green pipeline path */}
    <svg width={720} height={1280} style={{position: 'absolute', inset: 0}}>
      <line
        x1={352}
        y1={500}
        x2={560}
        y2={900}
        stroke={STAGE.green}
        strokeWidth={5}
        strokeDasharray="12 10"
        opacity={0.85}
      />
      <line
        x1={392}
        y1={500}
        x2={600}
        y2={900}
        stroke={STAGE.green}
        strokeWidth={5}
        strokeDasharray="12 10"
        opacity={0.5}
      />
    </svg>
  </div>
);

/** Glowing green ellipse pad under the instructor's feet. */
export const GlowPad: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 120}) => {
  const frame = useCurrentFrame();
  const pulse = 0.75 + Math.sin(frame * 0.1) * 0.25;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - 18,
        width: w,
        height: 36,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${STAGE.pad} 0%, ${STAGE.pad}55 45%, transparent 72%)`,
        opacity: pulse,
        filter: 'blur(1px)',
      }}
    />
  );
};

/** Particle burst: celebration pop at (x,y) starting at frame `at`. */
export const Burst: React.FC<{x: number; y: number; at: number; color?: string; n?: number}> = ({
  x,
  y,
  at,
  color = '#ffd24d',
  n = 22,
}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d > 30) return null;
  const hash = (k: number): number => {
    const v = Math.sin(k * 91.3 + 5.7) * 24634.1;
    return v - Math.floor(v);
  };
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const ang = hash(i) * Math.PI * 2;
        const dist = d * (6 + hash(i + 50) * 11);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(ang) * dist,
              top: y + Math.sin(ang) * dist,
              width: 3 + hash(i + 100) * 5,
              height: 3 + hash(i + 100) * 5,
              borderRadius: i % 3 === 0 ? 2 : '50%',
              background: i % 3 === 0 ? '#ffffff' : color,
              opacity: 1 - d / 30,
              transform: `rotate(${d * 12 + i * 20}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
export const PipelinePanel: React.FC<{progress?: number; steps?: string[]}> = ({
  progress,
  steps = PIPELINE_STEPS,
}) => {
  const frame = useCurrentFrame();
  const auto = progress ?? interpolate(frame, [0, 150], [0, 1], {extrapolateRight: 'clamp'});
  const lit = Math.round(auto * steps.length);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 128,
        background: STAGE.panelFill,
        border: `1px solid ${STAGE.panelBorder}`,
        borderRadius: 14,
        padding: '12px 16px 10px',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
        <span style={{color: STAGE.labelLight, fontSize: 11, fontWeight: 800, letterSpacing: 2}}>CI</span>
        <span style={{color: STAGE.labelLight, fontSize: 11, fontWeight: 800, letterSpacing: 2}}>CD</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {steps.map((step, i) => {
          const on = i < lit;
          const isProd = step === 'PROD' || step === 'DONE';
          return (
            <div key={step} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
              <div
                style={{
                  width: isProd ? 20 : 13,
                  height: isProd ? 20 : 13,
                  borderRadius: isProd ? 5 : '50%',
                  background: on ? STAGE.dot : '#23262d',
                  border: on ? 'none' : '1px solid #343945',
                  boxShadow: on ? `0 0 10px ${STAGE.dot}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b0e13',
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {isProd && on ? '⬢' : ''}
              </div>
              <div style={{color: on ? STAGE.labelLight : STAGE.labelGray, fontSize: 8, fontWeight: 700, letterSpacing: 0.5}}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
      {/* connector line behind dots */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          right: 30,
          top: 44,
          height: 2,
          background: '#23262d',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 30,
          width: `calc((100% - 60px) * ${auto})`,
          top: 44,
          height: 2,
          background: STAGE.dot,
          boxShadow: `0 0 8px ${STAGE.dot}`,
        }}
      />
    </div>
  );
};

/** Big white uppercase title — lines pop in with spring overshoot.
 *  A line can be a plain string (white) or {text, accent} to paint one
 *  phrase cyan (default accent #54E0EF). */
export const BigTitle: React.FC<{
  lines: Array<string | {text: string; accent?: string; accentColor?: string}>;
}> = ({lines}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 218,
        textAlign: 'center',
      }}
    >
      {lines.map((ln, i) => {
        const p = spring({frame: frame - i * 8, fps: 30, config: {damping: 12, stiffness: 160}});
        const text = typeof ln === 'string' ? ln : ln.text;
        const accent = typeof ln === 'string' ? undefined : ln.accent;
        const accentColor = typeof ln === 'string' ? '#54E0EF' : (ln.accentColor ?? '#54E0EF');
        const parts = accent ? text.split(accent) : [text];
        return (
          <div
            key={text}
            style={{
              color: '#ffffff',
              fontSize: 79,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: 1,
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              opacity: p,
              transform: `translateY(${(1 - p) * -46}px) scale(${0.92 + p * 0.08})`,
            }}
          >
            {parts.map((part, j) => (
              <span key={j}>
                {part}
                {j < parts.length - 1 && <span style={{color: accentColor}}>{accent}</span>}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Dark caption chip at the bottom (subtitle style of the sample). */
export const CaptionChip: React.FC<{parts: Array<{text: string; bold?: boolean; dim?: boolean}>}> = ({
  parts,
}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 948, display: 'flex', justifyContent: 'center'}}>
    <div
      style={{
        background: STAGE.chipFill,
        borderRadius: 10,
        padding: '10px 18px',
        fontSize: 36,
        display: 'flex',
        gap: 8,
      }}
    >
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            color: p.dim ? '#9c9c9c' : '#ffffff',
            fontWeight: p.bold ? 800 : 400,
          }}
        >
          {p.text}
        </span>
      ))}
    </div>
  </div>
);
