/**
 * aiRobotCustomize.ts
 * ------------------------------------------------------------------
 * A toolkit for FULLY customizing the "Ai Robot Vector Art" Lottie
 * animation (src/ai-robot.json) — colors, timing, mirroring, canvas,
 * layer visibility, and more. Every function returns a NEW deep-cloned
 * JSON so the original file is never mutated and different variants can
 * coexist in one render.
 *
 * How a Lottie file is structured (what we manipulate):
 *
 *   root
 *   ├─ w / h            canvas size
 *   ├─ ip / op          in/out point in frames
 *   ├─ fr               frame rate
 *   └─ layers[]         each layer:
 *       ├─ nm           name ("eyes", "head", "body", "ears", ...)
 *       ├─ parent       index of parent layer (nested transforms!)
 *       ├─ ks.p/a/s/r   transform (position/anchor/scale/rotation),
 *       │               either static values or keyframe arrays {t, s}
 *       └─ shapes[]     shape tree:
 *           ├─ gr       group (children in `it`)
 *           │   ├─ sh   path (bezier vertices in `ks.k.v`)
 *           │   ├─ el   ellipse
 *           │   ├─ rc   rectangle
 *           │   ├─ fl   flat fill   → color at c.k = [r,g,b,a]
 *           │   ├─ st   stroke       → color at c.k
 *           │   ├─ gf/gs gradient fill/stroke
 *           │   │       static:     g.k = [o1,r1,g1,b1, o2,r2,g2,b2, ...]
 *           │   │       animated:   g.k = [t1, o1,r1,g1,b1, ..., t2, ...]
 *           │   └─ tr   group transform (p/a/s/r like layers)
 *
 * This robot (682×902 canvas):
 *   - "body" (root): gray gradient panels, white highlights, dark detail
 *   - "head"  (child of body): big round head
 *   - "Face"  (child of head): dark blue-gray screen
 *   - "eyes"  (child of Face): cyan gradient eyes + white glints,
 *             position keyframes = the eye-dart/blink dance
 *   - "ears"  (child of head): top antenna + two side ears
 *   - "r hand"/"l hand" (children of body): rotation keyframes = waving
 *   - "Objects": floating particles, layer opacity 24%
 */

export type RGB = [number, number, number];
export type LottieJSON = Record<string, unknown> & {
  w: number;
  h: number;
  ip: number;
  op: number;
  fr: number;
  layers: LottieLayer[];
};

type LottieLayer = Record<string, unknown> & {
  nm: string;
  parent?: number;
  ks: Record<string, unknown>;
  shapes?: Record<string, unknown>[];
};

type KsEntry = {k: unknown; a?: number};

// ------------------------------------------------------------------
// Deep clone — every customizer works on a copy.
// ------------------------------------------------------------------
export const deepClone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

// ------------------------------------------------------------------
// Walk every node of a shape tree (groups recurse into `it`).
// ------------------------------------------------------------------
type ShapeNode = Record<string, unknown>;

export function walkShapes(
  shapes: ShapeNode[] | undefined,
  visit: (shape: ShapeNode) => void
): void {
  if (!shapes) return;
  for (const shape of shapes) {
    visit(shape);
    if (shape.ty === 'gr') {
      walkShapes(shape.it as ShapeNode[] | undefined, visit);
    }
  }
}

// ------------------------------------------------------------------
// COLOR DISCOVERY — list every unique color in the file.
// Useful to learn what exists before recoloring.
// ------------------------------------------------------------------
export function collectColors(json: LottieJSON): Array<{rgb: RGB; count: number}> {
  const found = new Map<string, {rgb: RGB; count: number}>();

  const add = (rgb: unknown): void => {
    if (!Array.isArray(rgb) || rgb.length < 3) return;
    if (rgb.some((n) => typeof n !== 'number')) return;
    const color: RGB = [
      Math.round((rgb[0] as number) * 255),
      Math.round((rgb[1] as number) * 255),
      Math.round((rgb[2] as number) * 255),
    ];
    const key = color.join(',');
    const entry = found.get(key) ?? {rgb: color, count: 0};
    entry.count++;
    found.set(key, entry);
  };

  // Flat fills + strokes
  walkShapes(json.layers.flatMap((l) => l.shapes ?? []), (shape) => {
    if (shape.ty === 'fl' || shape.ty === 'st') {
      add((shape.c as KsEntry).k);
    }
  });

  // Gradient stops (static: [o,r,g,b, o,r,g,b, ...])
  walkShapes(json.layers.flatMap((l) => l.shapes ?? []), (shape) => {
    if (shape.ty !== 'gf' && shape.ty !== 'gs') return;
    const g = shape.g as {k?: {k?: unknown[]}};
    const stops = g.k?.k;
    if (Array.isArray(stops) && typeof stops[0] === 'number') {
      for (let i = 1; i + 2 < stops.length; i += 4) {
        add([stops[i], stops[i + 1], stops[i + 2]]);
      }
    }
  });

  return [...found.values()].sort((a, b) => b.count - a.count);
}

// ------------------------------------------------------------------
// RECOLOR — replace colors everywhere (fills, strokes, gradients).
// `map` is keyed by "r,g,b" of the ORIGINAL color (0-255 ints).
// Unknown colors are matched to the NEAREST original key (within a
// tolerance) so anti-aliased near-variants recolor too.
// ------------------------------------------------------------------
export type ColorMap = Record<string, RGB>;

const colorKey = (rgb: RGB): string =>
  [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)].join(
    ','
  );

export function recolor(
  json: LottieJSON,
  map: ColorMap,
  tolerance = 0.3
): LottieJSON {
  const out = deepClone(json);
  const keys = Object.keys(map).map((k) => {
    const [r, g, b] = k.split(',').map(Number);
    return {rgb: [r / 255, g / 255, b / 255] as RGB, key: k};
  });

  const nearest = (rgb: RGB): RGB | null => {
    let best: RGB | null = null;
    let bestDist = tolerance;
    for (const {rgb: target, key} of keys) {
      const dist = Math.sqrt(
        (rgb[0] - target[0]) ** 2 +
          (rgb[1] - target[1]) ** 2 +
          (rgb[2] - target[2]) ** 2
      );
      if (dist < bestDist) {
        bestDist = dist;
        best = map[key];
      }
    }
    return best;
  };

  const mapColor = (target: unknown[], base: number): void => {
    if (base < 0 || base + 2 >= target.length) return;
    const mapped = nearest([
      target[base] as number,
      target[base + 1] as number,
      target[base + 2] as number,
    ]);
    if (mapped) {
      target[base] = clamp01(mapped[0]);
      target[base + 1] = clamp01(mapped[1]);
      target[base + 2] = clamp01(mapped[2]);
    }
  };

  walkShapes(out.layers.flatMap((l) => l.shapes ?? []), (shape) => {
    if (shape.ty === 'fl' || shape.ty === 'st') {
      const c = (shape.c as KsEntry).k as unknown[];
      mapColor(c, 0);
      return;
    }
    if (shape.ty !== 'gf' && shape.ty !== 'gs') return;
    const g = shape.g as {k?: {k?: unknown[]}};
    const stops = g.k?.k;
    if (!Array.isArray(stops) || typeof stops[0] !== 'number') return;
    // Static gradient: [o,r,g,b, o,r,g,b, ...] — recolor every stop.
    for (let i = 1; i + 2 < stops.length; i += 4) {
      mapColor(stops, i);
    }
  });

  return out;
}

// ------------------------------------------------------------------
// THEMES — the robot is drawn with a small fixed palette:
//   white / light / mid / dark grays, dark body detail,
//   dark blue face screen (3 shades), cyan eye gradient (3 shades).
// A theme = new values for that palette. White stays white.
// ------------------------------------------------------------------
type Palette = {
  light: RGB;
  mid: RGB;
  dark: RGB;
  darker: RGB;
  face1: RGB;
  face2: RGB;
  face3: RGB;
  eye1: RGB;
  eye2: RGB;
  eye3: RGB;
};

const ORIGINAL_PALETTE: Palette = {
  light: [0.894, 0.91, 0.937], // #E4E8EF  head/body light gray
  mid: [0.761, 0.778, 0.814], // #C2C6D0  mid gray
  dark: [0.627, 0.647, 0.69], // #A0A5B0  dark gray
  darker: [0.22, 0.22, 0.22], // #383838  body detail
  face1: [0.122, 0.278, 0.376], // #1F4760  face screen light
  face2: [0.088, 0.202, 0.273], // #163346  face screen mid
  face3: [0.055, 0.125, 0.169], // #0E202B  face screen dark
  eye1: [0.588, 0.961, 1.0], // #96F5FF  eye gradient light
  eye2: [0.459, 0.92, 0.969], // #75EBF7  eye gradient mid
  eye3: [0.329, 0.878, 0.937], // #54E0EF  eye gradient dark
};

export const THEMES: Record<string, Palette> = {
  original: ORIGINAL_PALETTE,
  cyber: {
    light: [0.78, 0.72, 0.96],
    mid: [0.63, 0.54, 0.87],
    dark: [0.47, 0.39, 0.73],
    darker: [0.16, 0.12, 0.3],
    face1: [0.2, 0.14, 0.4],
    face2: [0.15, 0.1, 0.3],
    face3: [0.1, 0.07, 0.21],
    eye1: [1.0, 0.55, 0.95],
    eye2: [0.95, 0.38, 0.85],
    eye3: [0.82, 0.25, 0.72],
  },
  sunset: {
    light: [0.98, 0.84, 0.71],
    mid: [0.93, 0.71, 0.54],
    dark: [0.81, 0.55, 0.38],
    darker: [0.3, 0.16, 0.1],
    face1: [0.28, 0.16, 0.12],
    face2: [0.21, 0.12, 0.09],
    face3: [0.15, 0.08, 0.06],
    eye1: [1.0, 0.97, 0.45],
    eye2: [1.0, 0.82, 0.3],
    eye3: [0.95, 0.65, 0.2],
  },
  matrix: {
    light: [0.72, 0.95, 0.75],
    mid: [0.5, 0.82, 0.56],
    dark: [0.31, 0.62, 0.38],
    darker: [0.06, 0.18, 0.09],
    face1: [0.06, 0.2, 0.14],
    face2: [0.045, 0.15, 0.1],
    face3: [0.03, 0.1, 0.07],
    eye1: [0.45, 1.0, 0.6],
    eye2: [0.3, 0.9, 0.45],
    eye3: [0.2, 0.75, 0.35],
  },
  ocean: {
    light: [0.71, 0.81, 0.96],
    mid: [0.52, 0.66, 0.88],
    dark: [0.34, 0.48, 0.75],
    darker: [0.08, 0.13, 0.26],
    face1: [0.06, 0.1, 0.22],
    face2: [0.045, 0.07, 0.16],
    face3: [0.03, 0.05, 0.11],
    eye1: [0.588, 0.961, 1.0], // keep original cyan eyes
    eye2: [0.459, 0.92, 0.969],
    eye3: [0.329, 0.878, 0.937],
  },
  gold: {
    light: [0.98, 0.91, 0.64],
    mid: [0.93, 0.8, 0.44],
    dark: [0.79, 0.63, 0.29],
    darker: [0.31, 0.23, 0.09],
    face1: [0.26, 0.19, 0.07],
    face2: [0.19, 0.14, 0.05],
    face3: [0.14, 0.1, 0.04],
    eye1: [1.0, 0.96, 0.72],
    eye2: [0.96, 0.86, 0.52],
    eye3: [0.87, 0.72, 0.35],
  },
};

export const THEME_NAMES = Object.keys(THEMES);

export function applyTheme(json: LottieJSON, theme: string): LottieJSON {
  const palette = THEMES[theme] ?? ORIGINAL_PALETTE;
  const map: ColorMap = {};
  for (const key of Object.keys(ORIGINAL_PALETTE) as Array<keyof Palette>) {
    map[colorKey(ORIGINAL_PALETTE[key])] = palette[key];
  }
  return recolor(json, map);
}

// ------------------------------------------------------------------
// RETIME — change playback speed by re-scaling every keyframe time.
// factor 0.5 = half speed (twice as long), factor 2 = double speed.
// ------------------------------------------------------------------
export function retime(json: LottieJSON, factor: number): LottieJSON {
  const out = deepClone(json);
  const scaleTimes = (value: unknown): void => {
    if (!Array.isArray(value)) return;
    for (const item of value) {
      if (item && typeof item === 'object' && 't' in item) {
        item.t = (item.t as number) / factor;
      }
    }
  };

  const walkProperties = (node: Record<string, unknown>): void => {
    for (const key of Object.keys(node)) {
      const value = node[key];
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        // keyframe array {t, s}
        scaleTimes(value);
        // recurse into keyframe values too (e.g. multi-dimensional s)
        for (const kf of value as Record<string, unknown>[]) {
          if (kf.s && typeof kf.s === 'object') {
            walkProperties(kf as Record<string, unknown>);
          }
        }
      } else if (value && typeof value === 'object') {
        walkProperties(value as Record<string, unknown>);
      }
    }
  };

  out.layers.forEach((layer) => walkProperties(layer as Record<string, unknown>));
  out.ip = Math.round(out.ip / factor);
  out.op = Math.round(out.op / factor);
  return out;
}

// ------------------------------------------------------------------
// MIRROR — flip the whole robot horizontally around the canvas
// vertical center (x' = w - x). Handles every x-bearing property:
// positions, anchors, path vertices, gradient start points, rotations.
// ------------------------------------------------------------------
export function mirrorX(json: LottieJSON): LottieJSON {
  const out = deepClone(json);
  const w = out.w;

  const mirrorXValue = (x: unknown): unknown => (typeof x === 'number' ? w - x : x);

  // keyframes: [x, y] or [x, y, z] position arrays, or scalar rotation
  const walkKs = (value: unknown, kind: 'p' | 'r'): void => {
    if (!Array.isArray(value)) return;
    // static value
    if (typeof value[0] === 'number') {
      if (kind === 'p' && value.length >= 2) value[0] = w - (value[0] as number);
      if (kind === 'r') value[0] = -(value[0] as number);
      return;
    }
    // keyframe array
    for (const kf of value as Array<{s: number[]}>) {
      if (Array.isArray(kf.s)) {
        if (kind === 'p' && kf.s.length >= 2) kf.s[0] = w - kf.s[0];
        if (kind === 'r') kf.s[0] = -kf.s[0];
      }
    }
  };

  for (const layer of out.layers) {
    const ks = layer.ks as Record<string, unknown>;
    walkKs((ks.p as KsEntry | undefined)?.k, 'p');
    walkKs((ks.a as KsEntry | undefined)?.k, 'p');
    walkKs((ks.r as KsEntry | undefined)?.k, 'r');

    walkShapes(layer.shapes, (shape) => {
      if (shape.ty === 'tr') {
        walkKs((shape.p as KsEntry | undefined)?.k, 'p');
        walkKs((shape.a as KsEntry | undefined)?.k, 'p');
        walkKs((shape.r as KsEntry | undefined)?.k, 'r');
      }
      if (shape.ty === 'sh') {
        const ksSh = (shape.ks as KsEntry).k as {v?: number[][]};
        if (ksSh && Array.isArray(ksSh.v)) {
          for (const vertex of ksSh.v) vertex[0] = w - vertex[0];
        }
      }
      if (shape.ty === 'el' || shape.ty === 'rc') {
        walkKs((shape.p as KsEntry | undefined)?.k, 'p');
      }
      if (shape.ty === 'gf' || shape.ty === 'gs') {
        // Gradient axis endpoints live in the same local space as the
        // path vertices, so they must mirror the SAME way (x -> w - x).
        const s = (shape.s as KsEntry | undefined)?.k as number[] | undefined;
        if (Array.isArray(s) && s.length >= 2) s[0] = w - s[0];
        const e = (shape.e as KsEntry | undefined)?.k as number[] | undefined;
        if (Array.isArray(e) && e.length >= 2) e[0] = w - e[0];
      }
    });
  }

  return out;
}

// ------------------------------------------------------------------
// HIDE LAYER — toggle visibility of any named part.
// ------------------------------------------------------------------
export function hideLayer(json: LottieJSON, name: string, hidden = true): LottieJSON {
  const out = deepClone(json);
  const layer = out.layers.find((l) => l.nm === name);
  if (layer) {
    layer.hd = hidden;
  }
  return out;
}

// ------------------------------------------------------------------
// RESIZE CANVAS — change w/h and center the robot in the new canvas.
// ------------------------------------------------------------------
export function resizeCanvas(json: LottieJSON, w: number, h: number): LottieJSON {
  const out = deepClone(json);
  const dx = (w - out.w) / 2;
  const dy = (h - out.h) / 2;

  // The "tr" transform item lives inside a group's `it` array and positions
  // the whole group. Shapes, gradients and children ride along, so shifting
  // every top-level group's tr.p moves exactly once — no vertex changes
  // needed for grouped shapes. Vertices/axes are only adjusted for shapes
  // sitting directly on the layer (not inside a group).
  const shift = (pt: unknown): void => {
    if (Array.isArray(pt) && typeof pt[0] === 'number') {
      (pt as number[])[0] += dx;
      (pt as number[])[1] += dy;
    }
  };

  for (const layer of out.layers) {
    for (const shape of layer.shapes ?? []) {
      if (shape.ty === 'gr') {
        const tr = (shape.it as ShapeNode[] | undefined)?.find((s) => s.ty === 'tr');
        if (tr) shift((tr.p as KsEntry | undefined)?.k);
      } else if (shape.ty === 'sh') {
        const ksSh = (shape.ks as KsEntry).k as {v?: number[][]};
        if (ksSh && Array.isArray(ksSh.v)) {
          for (const v of ksSh.v) {
            v[0] += dx;
            v[1] += dy;
          }
        }
      } else if (shape.ty === 'el' || shape.ty === 'rc') {
        shift((shape.p as KsEntry | undefined)?.k);
      } else if (shape.ty === 'gf' || shape.ty === 'gs') {
        shift((shape.s as KsEntry | undefined)?.k);
        shift((shape.e as KsEntry | undefined)?.k);
      }
    }
  }

  out.w = w;
  out.h = h;
  return out;
}
