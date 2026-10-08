# AI Robot — Lottie Customization Guide

The animation: **"Ai Robot Vector Art"** by [animoox](https://lottiefiles.com/free-animation/ai-robot-vector-art-uD5dnmVYlT)
Downloaded JSON → `ai-robot.json` (682×902, 180 frames @ 30fps, 10 layers, no external assets).

Lives in `apps/video` (`@ahmed-os/video`), the repo's Remotion workspace app.

## Render outputs

| File | Composition | What it shows |
|---|---|---|
| `out/ai-robot-original.mp4` | `AiRobotOriginal` (682×902, 6s) | The animation as downloaded |
| `out/ai-robot-education.mp4` | `AiRobotEducation` (682×902, 10s) | Educational version with popup callouts |
| `out/ai-robot-showcase.mp4` | `AiRobotShowcase` (720×1280, 60s) | Demo of everything: colors, timing, mirror, popups on/off |

Render commands (from the repo root):
```bash
pnpm --filter @ahmed-os/video render:ai-robot
pnpm --filter @ahmed-os/video render:ai-robot-education
pnpm --filter @ahmed-os/video render:ai-robot-showcase
```

## The robot's anatomy (Lottie layer hierarchy)

```
body (root, bobbing y±40)
├─ head            big round head
│  ├─ Face         dark screen (10-vertex path)
│  │  └─ eyes      6 groups: cyan gradient eyes + glints (position keyframes = blink/dart)
│  └─ ears         1 top antenna + 2 side ears
├─ r hand / r hand 2   rotation keyframes = waving
├─ l hand / l hand 2
Objects (root)      floating particles, layer opacity 24%
```

World positions (canvas 682×902) — used to anchor the popups:
antenna (340,142) · ears (105,270)/(575,270) · eyes (248,276)/(432,276) ·
face (340,300) · chest (340,520) · hands (126,594)/(554,594) · objects (340,845)

## How to customize (everything lives in `src/aiRobotCustomize.ts`)

All functions return a **new deep-cloned JSON** — the original is never mutated,
so you can have many variants at once.

```ts
import robotData from './ai-robot.json';
import {applyTheme, retime, mirrorX, hideLayer, resizeCanvas, collectColors} from './aiRobotCustomize';

// 1. See every color in the file
collectColors(robotData); // [{rgb: [228,232,239], count: 10}, ...]

// 2. Recolor with a preset theme: cyber | sunset | matrix | ocean | gold
const purple = applyTheme(robotData, 'cyber');

// 3. Change speed: 0.5 = half speed, 2 = double speed
const slow = retime(robotData, 0.5); // op becomes 360 frames

// 4. Mirror horizontally around the canvas center
const flipped = mirrorX(robotData);

// 5. Hide any part ("eyes", "ears", "r hand", ...)
const blind = hideLayer(robotData, 'eyes');

// 6. Move the robot into a bigger canvas (centered)
const padded = resizeCanvas(robotData, 800, 1000);
```

### How recoloring works under the hood

The robot's look is a small fixed palette:

| Role | Original (0–1 floats) | Where |
|---|---|---|
| light gray | `0.894, 0.91, 0.937` | head/body panels (gradient stops) |
| mid gray | `0.761, 0.778, 0.814` | gradient mid stops |
| dark gray | `0.627, 0.647, 0.69` | gradient dark stops |
| darker | `0.22, 0.22, 0.22` | body detail (flat fill) |
| face screen | `0.122, 0.278, 0.376` etc. | 3 gradient shades |
| eyes | `0.588, 0.961, 1.0` etc. | cyan gradient, 3 shades |

`recolor()` walks every shape node:
- `fl` (flat fill) / `st` (stroke) → color at `c.k = [r,g,b,a]`
- `gf` / `gs` (gradient fill/stroke) → stops at `g.k.k = [offset,r,g,b, offset,r,g,b, …]`

Every color is matched to the **nearest** palette entry (tolerance 0.3) and swapped —
so even anti-aliased in-between shades recolor correctly. Add a new theme by
extending `THEMES` with a new `Palette`.

### Changing shapes

Shapes are bezier paths: `layers[].shapes[].it[].ks.k.v` = vertex array of
`[x, y]` pairs (plus `i`/`o` tangents). Move, add or remove vertices to reshape
the robot. `mirrorX()` is a working example of vertex-level editing.

## Educational popups (`src/AiRobotEducation.tsx`)

Popup callouts are React overlays on top of the Lottie, each anchored to the
real part coordinates above:

- `anchors: [{x, y, r}]` — glowing ring(s) drawn ON the part
- `card: {x, y, w, h}` — text card position
- `appear` / `leave` — frame window, animated with springs
- connector line is drawn from the card edge nearest the anchor

Toggle everything with `showPopups={true|false}` — this is the "on/off" switch.
`frameOffset` re-aligns the internal timeline when embedded in another composition.

## Structure reference (Lottie JSON)

```
root {v, fr, ip, op, w, h, assets, layers}
layer {nm, parent, ip, op, ks{p,a,s,r,o}, shapes}
shape {ty}  gr=group(it:[]) sh=path(ks.k.v) el=ellipse rc=rect
            fl=fill(c.k) st=stroke(c.k) gf/gs=gradient(g.k.k) tr=transform
keyframes  {t: frame, s: value} — t is absolute frame number
```
