import { useId } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export type NexProceduralProps = {
  pose?: 'idle' | 'explain' | 'point';
  speaking?: boolean;
  animate?: boolean;
};

// All character geometry is authored here. No Img, textures, sprites, or assets.
// This is a 2.5D vector interpretation, not a photorealistic 3D reconstruction.
export function NexProcedural({ pose = 'idle', speaking = false, animate = true }: NexProceduralProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = `nex-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const paint = (name: string) => `url(#${id}-${name})`;
  const time = animate ? frame / fps : 0;
  const float = Math.sin(time * 1.7) * 4;
  const nod = speaking ? Math.sin(time * 4) * 1.2 : Math.sin(time * 0.9) * 0.5;
  const blink = animate && time % 4.3 > 4.16 ? 0.14 : 1;
  const reactor = 0.8 + Math.sin(time * 3.2) * 0.12;
  const gesture = pose === 'idle' ? 0 : pose === 'point' ? 1 : 0.7;

  const seam = '#070b12';
  const cyan = '#45cfff';

  function Plate({ d, fill = 'steel', stroke = '#596473' }: { d: string; fill?: string; stroke?: string }) {
    return <path d={d} fill={paint(fill)} stroke={stroke} strokeWidth={1.2} strokeLinejoin="round" />;
  }

  function Light({ d, width = 2.5 }: { d: string; width?: number }) {
    return <path d={d} fill="none" stroke={cyan} strokeWidth={width} filter={paint('glow')} strokeLinecap="round" />;
  }

  function Joint({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r={r} fill={paint('black')} stroke="#8693a5" strokeWidth={2} />
        <circle r={r * 0.68} fill="#03060d" stroke="#2b3949" strokeWidth={3} />
        <circle r={r * 0.42} fill={paint('energy')} />
        <circle r={r * 0.56} fill="none" stroke={cyan} strokeWidth={1.4} filter={paint('glow')} />
        <circle cx={-r * 0.25} cy={-r * 0.3} r={r * 0.12} fill="#e8faff" />
      </g>
    );
  }

  function Hand({ open }: { open: boolean }) {
    return (
      <g>
        <Plate d="M-21 -7 L-27 18 L-19 48 L9 54 L23 27 L20 -3 L1 -13Z" fill="black" />
        <Plate d="M-17 -3 L-21 14 L-12 39 L7 41 L16 20 L13 -1 L0 -6Z" />
        <path d="M-10 9 L9 13 L6 28 L-8 24Z" fill="#0c1724" />
        <Light d="M-8 13 L6 16" width={1.6} />
        {[0, 1, 2, 3].map((finger) => {
          const bend = open ? (finger - 1.5) * 10 : 7 - finger * 3;
          const length = finger === 0 || finger === 3 ? 26 : 35;
          return (
            <g key={finger} transform={`translate(${-14 + finger * 9} 39) rotate(${bend})`}>
              <rect x={-4} y={0} width={8} height={length * 0.53} rx={2} fill={paint('steel')} stroke={seam} strokeWidth={1.4} />
              <circle cy={length * 0.53} r={4.2} fill="#131b27" stroke="#94a6b8" strokeWidth={0.8} />
              <g transform={`translate(0 ${length * 0.53}) rotate(${open ? -9 : 40})`}>
                <rect x={-3.7} y={0} width={7.4} height={length * 0.47} rx={2.5} fill={paint('steel')} stroke={seam} strokeWidth={1.1} />
              </g>
            </g>
          );
        })}
        <g transform="translate(-22 13) rotate(40)">
          <rect x={-5} width={10} height={20} rx={3} fill={paint('steel')} stroke={seam} strokeWidth={1.2} />
          <rect x={-4} y={19} width={8} height={14} rx={3} fill={paint('steel')} stroke={seam} strokeWidth={1.2} />
        </g>
      </g>
    );
  }

  function Arm({ side }: { side: -1 | 1 }) {
    const lift = side === -1 ? gesture * 36 : -gesture * 8;
    const elbow = side === -1 ? gesture * 74 : gesture * 12;
    return (
      <g transform={`translate(${side * 144} -245) scale(${side} 1) rotate(${lift})`}>
        <path d="M-13 -20 Q35 -30 49 1 L49 87 L19 143 L-6 126 L-24 51Z" fill={paint('black')} stroke={seam} strokeWidth={4} />
        <Plate d="M-8 18 L26 10 L37 37 L33 72 L10 112 L-4 92 L-12 52Z" fill="steel" />
        <Plate d="M26 13 L40 22 L38 68 L31 84 L29 50Z" fill="edge" />
        <Plate d="M-10 38 L3 26 L13 52 L2 89 L-5 76Z" fill="graphite" />
        <Light d="M34 34 L30 66 L16 92" />
        <path d="M-3 102 L9 95 L19 105 L14 116Z" fill="#09101a" />
        <Joint x={8} y={126} r={18} />
        <g transform={`translate(8 126) rotate(${elbow})`}>
          <path d="M-17 6 L20 0 L38 73 L20 142 L-12 149 L-27 94Z" fill={paint('black')} stroke={seam} strokeWidth={3} />
          <Plate d="M-12 16 L12 12 L23 45 L19 81 L6 126 L-12 121 L-18 73Z" />
          <Plate d="M17 24 L29 62 L18 117 L9 136 L9 104 L20 64Z" fill="edge" />
          <Plate d="M-21 54 L-13 38 L-6 77 L-16 106Z" fill="graphite" />
          <Light d="M-6 31 L-7 58 L0 82" />
          <path d="M-17 126 L11 130 L13 143 L-12 149Z" fill={paint('steel')} stroke={seam} strokeWidth={2} />
          <g transform="translate(0 155) rotate(-9)">
            <Hand open={pose !== 'idle' && side === -1} />
          </g>
        </g>
      </g>
    );
  }

  function Leg({ side }: { side: -1 | 1 }) {
    return (
      <g transform={`translate(${side * 59} 80) scale(${side} 1) rotate(-3)`}>
        <path d="M-32 -8 L28 4 L40 38 L49 124 L23 211 L-16 216 L-31 121 L-44 50Z" fill={paint('black')} stroke={seam} strokeWidth={3} />
        <Plate d="M-26 13 L15 23 L30 61 L22 123 L1 178 L-19 181 L-24 112 L-34 55Z" />
        <Plate d="M19 23 L35 43 L41 115 L26 154 L23 128 L30 80Z" fill="edge" />
        <Plate d="M-29 65 L-14 87 L-12 146 L-22 153 L-30 123Z" fill="graphite" />
        <Light d="M-21 100 L-16 142 L-8 158" />
        <path d="M-22 174 L10 178 L23 195 L10 216 L-18 215 L-30 194Z" fill={paint('black')} stroke="#6a788b" strokeWidth={1.4} />
        <Joint x={-5} y={196} r={19} />
        <path d="M-25 224 L20 222 L32 307 L17 375 L-13 396 L-31 354 L-37 285Z" fill={paint('black')} stroke={seam} strokeWidth={3} />
        <Plate d="M-17 228 L13 229 L22 260 L12 321 L-6 375 L-18 376 L-27 309 L-26 264Z" />
        <Plate d="M17 244 L29 274 L24 332 L11 365 L8 345 L19 294Z" fill="edge" />
        <Plate d="M-21 240 L-10 251 L-14 303 L-21 328 L-25 286Z" fill="graphite" />
        <Light d="M-10 253 L-12 276 L-7 300" />
        <path d="M-17 369 L11 367 L24 405 L6 417 L-27 407Z" fill={paint('black')} stroke="#536274" strokeWidth={2} />
        <Joint x={-5} y={386} r={11} />
        <path d="M-25 396 L15 393 L48 419 L56 443 L23 458 L-31 451 L-40 430Z" fill={paint('black')} stroke={seam} strokeWidth={3} />
        <Plate d="M-24 397 L10 397 L25 414 L10 433 L-24 429 L-33 417Z" />
        <Plate d="M27 414 L43 427 L48 439 L22 449 L12 435Z" fill="edge" />
        <Light d="M-31 439 L-11 447 L21 450 L48 439" width={2.2} />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 800 1200" width="100%" height="100%" role="img" aria-label="NEX procedural vector robot">
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0.7">
          <stop stopColor="#f0f5fb" /><stop offset=".16" stopColor="#a9b6c9" />
          <stop offset=".35" stopColor="#e0e9f6" /><stop offset=".48" stopColor="#728095" />
          <stop offset=".7" stopColor="#434d60" /><stop offset="1" stopColor="#121b2a" />
        </linearGradient>
        <linearGradient id={`${id}-graphite`} x1="0" y1="0" x2="1" y2=".9">
          <stop stopColor="#768495" /><stop offset=".25" stopColor="#303b4a" />
          <stop offset=".58" stopColor="#101722" /><stop offset="1" stopColor="#02050b" />
        </linearGradient>
        <linearGradient id={`${id}-black`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#30394a" /><stop offset=".32" stopColor="#070c16" />
          <stop offset=".72" stopColor="#010307" /><stop offset="1" stopColor="#1d2b3c" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#303c52" /><stop offset=".38" stopColor="#c9d8ee" />
          <stop offset=".5" stopColor="#ffffff" /><stop offset=".67" stopColor="#7f94b1" />
          <stop offset="1" stopColor="#1b2433" />
        </linearGradient>
        <radialGradient id={`${id}-energy`}>
          <stop stopColor="#ffffff" /><stop offset=".27" stopColor="#c8f5ff" />
          <stop offset=".58" stopColor="#38cfff" /><stop offset=".82" stopColor="#087eee" />
          <stop offset="1" stopColor="#051327" />
        </radialGradient>
        <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#187ce8" stopOpacity=".08" /><stop offset=".5" stopColor="#187ce8" stopOpacity=".27" />
          <stop offset=".9" stopColor="#55d4ff" stopOpacity=".72" /><stop offset="1" stopColor="#dcfcff" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g transform={`translate(400 ${610 + float})`}>
        {/* Rear fins: translucent polygons with code-drawn energy veins. */}
        {([-1, 1] as const).map((side) => (
          <g key={side} transform={`scale(${side} 1)`} opacity={0.6 + reactor * 0.22}>
            <path d="M97 -245 L144 -273 Q227 -13 229 205 L194 416 L134 244 L112 36Z" fill={paint('fin')} stroke="#359ded" strokeWidth={1.6} />
            <Light d="M144 -273 Q227 -13 229 205 L194 416" width={2} />
            <g stroke="#67cfff" strokeWidth={0.7} opacity={0.42} fill="none">
              <path d="M133 -168 L162 -130 L149 -71 L183 -34 L161 33 L198 91 L171 151 L205 221 L182 304" />
              <path d="M163 -84 L189 -69 L181 -19 L204 12 L181 69 L213 147 L193 194 L215 264" />
              <path d="M149 -71 L163 -84 M161 33 L181 69 M171 151 L193 194 M205 221 L215 264" />
            </g>
          </g>
        ))}

        <Leg side={-1} /><Leg side={1} />
        {/* Jointed arms render behind breastplate and shoulder caps. */}
        <Arm side={1} /><Arm side={-1} />

        {/* Underbody with interlocking abdominal plating, not a flat chest. */}
        <path d="M-77 -324 L67 -324 L140 -260 L117 -141 L79 -22 L86 68 L37 123 L-38 128 L-88 61 L-79 -34 L-124 -139 L-143 -254Z" fill={paint('black')} stroke={seam} strokeWidth={4} />
        {[-1, 1].map((side) => (
          <g key={side} transform={`scale(${side} 1)`}>
            <Plate d="M-3 -153 L48 -169 L72 -148 L64 -120 L8 -89 L0 -105Z" fill="graphite" />
            <Plate d="M4 -90 L58 -116 L67 -91 L44 -59 L9 -45Z" fill="graphite" />
            <Plate d="M9 -43 L41 -58 L55 -36 L33 -7 L12 8Z" fill="graphite" />
            <Plate d="M39 -27 L75 -54 L81 -12 L62 30 L35 58 L18 33Z" />
            <Plate d="M37 37 L81 14 L88 50 L64 80 L42 73 L23 54Z" fill="edge" />
            <Plate d="M38 78 L61 85 L45 115 L12 136 L4 112Z" fill="graphite" />
            <path d="M86 -173 L109 -176 L99 -119 L78 -89 L69 -103Z" fill="#02060b" />
            <Light d="M102 -149 L89 -116" />
            <Plate d="M76 -104 L97 -127 L92 -75 L75 -45 L66 -70Z" fill="black" />
            <Plate d="M-3 -312 L51 -319 L95 -294 L130 -249 L84 -194 L34 -211 L3 -247Z" />
            <Plate d="M45 -310 L71 -312 L118 -273 L126 -251 L88 -263Z" fill="edge" />
            <Plate d="M9 -244 L38 -224 L84 -213 L76 -191 L37 -199 L4 -216Z" fill="graphite" />
            <Plate d="M57 -278 L110 -244 L83 -223 L51 -239Z" fill="black" />
            <Light d="M60 -263 L86 -246" width={3} />
            {/* Layered angular shoulder cap + exposed mechanical socket. */}
            <Joint x={140} y={-262} r={28} />
            <Plate d="M103 -305 L145 -321 L181 -307 L196 -281 L185 -246 L155 -243 L134 -268 L99 -284Z" />
            <Plate d="M133 -311 L150 -314 L179 -302 L189 -281 L183 -269 L162 -295Z" fill="edge" />
            <Plate d="M105 -294 L126 -283 L147 -256 L130 -245 L108 -270Z" fill="black" />
            <Light d="M174 -261 L183 -274" width={2.4} />
          </g>
        ))}

        {/* Circular chest reactor seated in a heavy beveled housing. */}
        <g transform="translate(0 -267)">
          <path d="M-39 -17 L-21 -38 L13 -41 L38 -17 L41 17 L18 42 L-15 43 L-43 18Z" fill={paint('graphite')} stroke="#8395ac" strokeWidth={2} />
          <circle r={30} fill="#071427" stroke={paint('edge')} strokeWidth={6} />
          <circle r={26} fill="none" stroke="#1799ff" strokeWidth={2.5} filter={paint('glow')} />
          <g transform={`rotate(${time * 18})`}>
            <circle r={22} fill="none" stroke="#bdeaff" strokeWidth={2} strokeDasharray="14 6" />
          </g>
          <circle r={18} fill={paint('energy')} opacity={reactor} filter={paint('glow')} />
          <circle r={9} fill="#defaff" /><circle cx={-4} cy={-5} r={4} fill="#fff" />
          {[0, 90, 180, 270].map((a) => <circle key={a} transform={`rotate(${a})`} cx={0} cy={36} r={2} fill="#050912" stroke="#a8b3c6" />)}
        </g>

        {/* Mechanical neck and collar. */}
        <path d="M-30 -365 L29 -365 L39 -316 L20 -298 L-17 -299 L-41 -319Z" fill={paint('black')} stroke="#3b4859" strokeWidth={2} />
        {[-24, -12, 0, 12, 24].map((x) => <path key={x} d={`M${x} -357 L${x * 0.78} -315`} stroke="#66758a" strokeWidth={2.8} />)}
        <Plate d="M-69 -329 L-31 -348 L-17 -321 L-1 -311 L-11 -297 L-53 -309Z" />
        <Plate d="M66 -330 L30 -348 L16 -321 L1 -311 L12 -298 L53 -310Z" />
        <Light d="M-25 -317 L-5 -311 L18 -317" width={1.4} />

        {/* Helmet: segmented dome, deep black face, narrow slanted cyan eyes. */}
        <g transform={`rotate(${nod} 0 -448)`}>
          <ellipse cx={-75} cy={-447} rx={18} ry={39} fill={paint('edge')} stroke="#152438" strokeWidth={3} />
          <ellipse cx={-80} cy={-447} rx={13} ry={29} fill="#061222" stroke="#80d5ff" strokeWidth={3} />
          <ellipse cx={-80} cy={-447} rx={8} ry={20} fill={paint('energy')} filter={paint('glow')} />
          <ellipse cx={74} cy={-447} rx={13} ry={35} fill={paint('edge')} stroke="#162337" strokeWidth={2} />
          <ellipse cx={77} cy={-447} rx={7} ry={24} fill="#061222" stroke={cyan} strokeWidth={2} />
          <path d="M-68 -493 Q-63 -555 -12 -567 Q30 -574 64 -529 L76 -474 L66 -408 L39 -369 L5 -351 L-28 -364 L-63 -411 L-77 -455Z" fill={paint('black')} stroke="#7c899c" strokeWidth={1.8} />
          <Plate d="M-61 -495 Q-52 -544 -23 -555 L-29 -529 L-45 -500 L-46 -470 L-66 -456 L-73 -469Z" />
          <Plate d="M-22 -559 Q8 -570 34 -551 L22 -519 L0 -505 L-21 -529Z" fill="graphite" />
          <Plate d="M35 -550 Q55 -541 64 -519 L66 -488 L46 -469 L25 -520Z" fill="graphite" />
          <Plate d="M-28 -529 L-19 -527 L-4 -501 L-6 -458 L-19 -460 L-35 -495Z" fill="edge" />
          <Plate d="M-66 -454 L-51 -459 L-39 -424 L-22 -398 L-24 -372 L-48 -394 L-67 -427Z" />
          <Plate d="M62 -460 L68 -438 L53 -402 L29 -372 L16 -368 L26 -401 L43 -427Z" />
          <path d="M-45 -482 L-21 -460 L-7 -452 L-1 -381 L6 -359 L-16 -371 L-33 -403 L-48 -452Z" fill="#010409" />
          <path d="M19 -467 L45 -488 L50 -452 L37 -410 L15 -379 L6 -359 L7 -426Z" fill="#02050a" />
          <path d="M-20 -463 L-2 -446 L4 -399 L-7 -380 L-18 -407Z" fill="#111a26" opacity={0.8} />
          <path d="M27 -470 L14 -444 L12 -405 L30 -427Z" fill="#0b131f" />
          <Light d="M-31 -526 L-22 -501 L-19 -480" width={2.2} />
          <path d="M-62 -507 L-48 -524 L-37 -526" fill="none" stroke="#f0f6ff" strokeWidth={2} opacity={0.8} />
          <path d="M10 -563 Q36 -556 50 -541" fill="none" stroke="#d5e1f4" strokeWidth={1.8} opacity={0.65} />
          <path d="M-57 -456 L-23 -438 L-14 -419 L-40 -428 L-53 -440Z" fill="#063462" />
          <path d="M48 -454 L17 -438 L12 -420 L37 -431 L46 -441Z" fill="#063462" />
          <g transform={`translate(0 -437) scale(1 ${blink}) translate(0 437)`}>
            <path d="M-54 -453 L-26 -439 L-19 -426 L-38 -432 L-50 -441Z" fill={paint('energy')} filter={paint('glow')} />
            <path d="M46 -451 L21 -438 L16 -426 L34 -433 L43 -441Z" fill={paint('energy')} filter={paint('glow')} />
            <path d="M-50 -451 L-27 -439 M42 -449 L22 -438" stroke="#e8fdff" strokeWidth={2} />
          </g>
          <path d="M-26 -381 L-8 -368 L7 -358 L23 -376" fill="none" stroke="#52677f" strokeWidth={1.4} />
          <path d="M-45 -414 L-35 -408 M44 -416 L36 -410" stroke="#d1ddec" strokeWidth={1.5} />
        </g>
      </g>
    </svg>
  );
}
