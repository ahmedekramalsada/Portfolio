/**
 * AiRobotShowcase.tsx
 * ------------------------------------------------------------------
 * The demo video: "all the things you can do with one Lottie file".
 * 720×1280, 30fps, 1800 frames (60s).
 *
 * Scenes:
 *   0–75      title card
 *   75–255    original animation
 *   255–435   recolor → cyber
 *   435–615   recolor → sunset
 *   615–795   recolor → matrix
 *   795–975   recolor → ocean
 *   975–1155  recolor → gold
 *   1155–1335 retime 0.5× + mirrorX side-by-side
 *   1335–1635 education mode (popups ON)
 *   1635–1725 education mode (popups OFF — the on/off toggle)
 *   1725–1800 outro
 */
import {useCurrentFrame, interpolate, spring} from 'remotion';
import {Lottie} from '@remotion/lottie';
import robotData from './ai-robot.json';
import {AiRobotEducation} from './AiRobotEducation';
import {
  applyTheme,
  mirrorX,
  retime,
  type LottieJSON,
} from './aiRobotCustomize';

const W = 720;
const H = 1280;

const ROBOT = robotData as unknown as LottieJSON;
const SLOW_ROBOT = retime(ROBOT, 0.5); // 360 frames = half speed
const MIRRORED_ROBOT = mirrorX(ROBOT);

const THEMES = ['original', 'cyber', 'sunset', 'matrix', 'ocean', 'gold'] as const;
type ThemeId = (typeof THEMES)[number];

const THEME_LABELS: Record<ThemeId, {name: string; color: string; note: string}> = {
  original: {name: 'Original', color: '#54E0EF', note: 'the animation as downloaded'},
  cyber: {name: 'Cyber', color: '#E57BFF', note: 'applyTheme() — purple palette'},
  sunset: {name: 'Sunset', color: '#FFB34D', note: 'applyTheme() — warm palette'},
  matrix: {name: 'Matrix', color: '#6DF07E', note: 'applyTheme() — green palette'},
  ocean: {name: 'Ocean', color: '#4FA8FF', note: 'applyTheme() — blue palette'},
  gold: {name: 'Gold', color: '#FFD24D', note: 'applyTheme() — gold palette'},
};

const themeJson = (id: ThemeId): LottieJSON =>
  id === 'original' ? ROBOT : applyTheme(ROBOT, id);

const SCENES: Array<{from: number; to: number; id: string}> = [
  {from: 0, to: 75, id: 'title'},
  {from: 75, to: 255, id: 'original'},
  {from: 255, to: 435, id: 'cyber'},
  {from: 435, to: 615, id: 'sunset'},
  {from: 615, to: 795, id: 'matrix'},
  {from: 795, to: 975, id: 'ocean'},
  {from: 975, to: 1155, id: 'gold'},
  {from: 1155, to: 1335, id: 'time-mirror'},
  {from: 1335, to: 1635, id: 'education'},
  {from: 1635, to: 1725, id: 'education-off'},
  {from: 1725, to: 1800, id: 'outro'},
];

const sceneFor = (frame: number): {scene: {from: number; to: number; id: string}; local: number} => {
  for (const scene of SCENES) {
    if (frame >= scene.from && frame < scene.to) {
      return {scene, local: frame - scene.from};
    }
  }
  const last = SCENES[SCENES.length - 1];
  return {scene: last, local: frame - last.from};
};

const sceneFade = (local: number, duration: number): number =>
  interpolate(
    local,
    [0, 10, duration - 10, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

export const AiRobotShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const {scene, local} = sceneFor(frame);

  return (
    <div
      style={{
        width: W,
        height: H,
        background: 'radial-gradient(ellipse at 50% 30%, #10142B 0%, #070A17 60%, #04060E 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#FFFFFF',
      }}
    >
      <Backdrop />

      {scene.id === 'title' && <TitleCard frame={frame} />}

      {THEMES.map((themeId, i) => {
        const {from} = SCENES[1 + i]; // scene offsets align with THEMES order
        if (scene.id !== themeId) return null;
        const info = THEME_LABELS[themeId];
        return (
          <RobotScene
            key={themeId}
            json={themeJson(themeId)}
            label={`${String(1 + i).padStart(2, '0')} · ${info.name}`}
            accent={info.color}
            note={info.note}
            local={local}
            robotTop={330}
            robotScale={1.02}
          />
        );
      })}

      {scene.id === 'time-mirror' && (
        <TimeMirrorScene local={local} />
      )}

      {scene.id === 'education' && (
        <EducationScene popups local={local} frameOffset={1335} />
      )}

      {scene.id === 'education-off' && (
        <EducationScene popups={false} local={local} frameOffset={1635 - 100} />
      )}

      {scene.id === 'outro' && <OutroCard frame={frame} />}
    </div>
  );
};

// ------------------------------------------------------------------
// Shared backdrop: grid + soft glows
// ------------------------------------------------------------------
const Backdrop: React.FC = () => (
  <div style={{position: 'absolute', inset: 0}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(84,224,239,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(84,224,239,0.045) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '20%',
        width: 620,
        height: 620,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(84,224,239,0.10) 0%, transparent 70%)',
      }}
    />
  </div>
);

// ------------------------------------------------------------------
// A full-size robot scene with label + note
// ------------------------------------------------------------------
const RobotScene: React.FC<{
  json: LottieJSON;
  label: string;
  accent: string;
  note: string;
  local: number;
  robotTop: number;
  robotScale: number;
}> = ({json, label, accent, note, local, robotTop, robotScale}) => {
  const opacity = sceneFade(local, 180);
  const labelIn = spring({
    frame: local,
    fps: 30,
    config: {damping: 14, stiffness: 110},
  });

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      {/* label */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          textAlign: 'center',
          transform: `translateY(${(1 - labelIn) * -20}px)`,
          opacity: labelIn,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '10px 26px',
            borderRadius: 999,
            border: `1px solid ${accent}66`,
            background: 'rgba(8,11,24,0.8)',
            color: accent,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          {label}
        </div>
        <div style={{color: '#93A5BC', fontSize: 14, marginTop: 10, letterSpacing: 1}}>
          {note}
        </div>
      </div>

      {/* robot */}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - (ROBOT.w * robotScale) / 2,
          top: robotTop,
          width: ROBOT.w * robotScale,
          height: ROBOT.h * robotScale,
          filter: 'drop-shadow(0 0 46px rgba(84,224,239,0.14))',
        }}
      >
        <Lottie animationData={json} loop style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Time & mirror: normal-speed robot next to 0.5× and mirrored
// ------------------------------------------------------------------
const TimeMirrorScene: React.FC<{local: number}> = ({local}) => {
  const opacity = sceneFade(local, 180);
  const labelIn = spring({
    frame: local,
    fps: 30,
    config: {damping: 14, stiffness: 110},
  });
  const scale = 0.5;

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          textAlign: 'center',
          transform: `translateY(${(1 - labelIn) * -20}px)`,
          opacity: labelIn,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '10px 26px',
            borderRadius: 999,
            border: '1px solid #54E0EF66',
            background: 'rgba(8,11,24,0.8)',
            color: '#54E0EF',
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          07 · Time + Mirror
        </div>
        <div style={{color: '#93A5BC', fontSize: 14, marginTop: 10, letterSpacing: 1}}>
          retime(0.5×) and mirrorX() — pure JSON transforms
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
        }}
      >
        <MiniRobot json={SLOW_ROBOT} scale={scale} caption="0.5× slow motion" />
        <MiniRobot json={MIRRORED_ROBOT} scale={scale} caption="mirrored" />
      </div>
    </div>
  );
};

const MiniRobot: React.FC<{
  json: LottieJSON;
  scale: number;
  caption: string;
}> = ({json, scale, caption}) => (
  <div style={{textAlign: 'center'}}>
    <div
      style={{
        width: ROBOT.w * scale,
        height: ROBOT.h * scale,
        margin: '0 auto',
        filter: 'drop-shadow(0 0 30px rgba(84,224,239,0.12))',
      }}
    >
      <Lottie animationData={json} loop style={{width: '100%', height: '100%'}} />
    </div>
    <div
      style={{
        color: '#C6D3E2',
        fontSize: 14,
        fontWeight: 600,
        marginTop: 8,
        letterSpacing: 1,
      }}
    >
      {caption}
    </div>
  </div>
);

// ------------------------------------------------------------------
// Education mode: the popup version, scaled to fit 720px wide.
// `frameOffset` aligns the child's internal timeline with the parent.
// ------------------------------------------------------------------
const EducationScene: React.FC<{
  popups: boolean;
  local: number;
  frameOffset: number;
}> = ({popups, local, frameOffset}) => {
  const opacity = sceneFade(local, popups ? 300 : 90);
  const labelIn = spring({
    frame: local,
    fps: 30,
    config: {damping: 14, stiffness: 110},
  });
  const scale = W / ROBOT.w; // 720 / 682

  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          transform: `translateY(${(1 - labelIn) * -20}px)`,
          opacity: labelIn,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '10px 26px',
            borderRadius: 999,
            border: '1px solid #54E0EF66',
            background: 'rgba(8,11,24,0.85)',
            color: '#54E0EF',
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          {popups ? '08 · Education mode — popups ON' : '08 · Education mode — popups OFF'}
        </div>
        <div style={{color: '#93A5BC', fontSize: 14, marginTop: 10, letterSpacing: 1}}>
          callouts anchored to real part coordinates · showPopups = {popups ? 'true' : 'false'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 150,
          width: ROBOT.w,
          height: ROBOT.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
        }}
      >
        <AiRobotEducation showPopups={popups} frameOffset={frameOffset} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Title card
// ------------------------------------------------------------------
const TitleCard: React.FC<{frame: number}> = ({frame}) => {
  const t1 = spring({frame, fps: 30, config: {damping: 13, stiffness: 90}});
  const t2 = spring({frame: frame - 14, fps: 30, config: {damping: 13, stiffness: 90}});
  const t3 = spring({frame: frame - 30, fps: 30, config: {damping: 14, stiffness: 100}});
  const fade = interpolate(frame, [60, 74], [1, 0], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fade,
        textAlign: 'center',
        padding: '0 50px',
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 40,
          border: '2px solid #54E0EF55',
          background: 'rgba(84,224,239,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 46,
          transform: `scale(${t1})`,
          boxShadow: '0 0 60px rgba(84,224,239,0.15)',
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            border: '3px solid #54E0EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#54E0EF',
            fontSize: 44,
            fontWeight: 900,
          }}
        >
          AI
        </div>
      </div>

      <div
        style={{
          color: '#54E0EF',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 5,
          textTransform: 'uppercase',
          marginBottom: 18,
          opacity: t2,
        }}
      >
        One Lottie file
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          lineHeight: 1.15,
          opacity: t2,
          transform: `translateY(${(1 - t2) * 20}px)`,
        }}
      >
        Everything you can do
        <br />
        <span style={{color: '#54E0EF'}}>with a robot animation</span>
      </div>
      <div
        style={{
          color: '#93A5BC',
          fontSize: 17,
          marginTop: 34,
          letterSpacing: 1,
          opacity: t3,
        }}
      >
        colors · timing · mirror · popups · education
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Outro
// ------------------------------------------------------------------
const OutroCard: React.FC<{frame: number}> = ({frame}) => {
  const local = frame - 1725;
  const t1 = spring({frame: local, fps: 30, config: {damping: 13, stiffness: 90}});
  const fade = interpolate(local, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fade,
        textAlign: 'center',
        padding: '0 50px',
      }}
    >
      <div
        style={{
          color: '#54E0EF',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 5,
          textTransform: 'uppercase',
          marginBottom: 18,
          transform: `scale(${t1})`,
        }}
      >
        That's a wrap
      </div>
      <div style={{fontSize: 38, fontWeight: 900, lineHeight: 1.2}}>
        Fully customizable,
        <br />
        <span style={{color: '#54E0EF'}}>one JSON away</span>
      </div>
      <div style={{color: '#93A5BC', fontSize: 16, marginTop: 30, letterSpacing: 1}}>
        Lottie + Remotion · aiRobotCustomize.ts
      </div>
    </div>
  );
};
