/**
 * SampleStyleDemo.tsx
 * ------------------------------------------------------------------
 * Test video: our robot instructor inside the sample's visual world.
 * Pipeline panel → big title → robot on glow pad → caption chip.
 */
import {useCurrentFrame, interpolate} from 'remotion';
import {InstructorRobot} from './InstructorRobot';
import {
  StageBackground,
  ServerFarm,
  GlowPad,
  PipelinePanel,
  BigTitle,
  CaptionChip,
} from './SampleStage';

export const SAMPLE_STYLE_DURATION = 240; // 8s @30fps

export const SampleStyleDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [15, 30], [0, 1], {extrapolateRight: 'clamp'});
  const robotIn = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chipOpacity = interpolate(frame, [200, 215], [1, 0], {extrapolateRight: 'clamp'});

  // robot gently drifts in from the left like walking on stage
  const robotX = interpolate(frame, [30, 55], [120, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
      <ServerFarm />

      <PipelinePanel />

      <div style={{opacity: titleOpacity}}>
        <BigTitle lines={['NO HUMAN', 'NEEDED']} />
      </div>

      <GlowPad x={robotX} y={880} w={130} />
      <div style={{opacity: robotIn}}>
        <InstructorRobot expression="happy" size={300} x={robotX} y={696} speaking />
      </div>

      <div style={{opacity: chipOpacity}}>
        <CaptionChip
          parts={[
            {text: 'production.'},
            {text: 'No', bold: true},
            {text: 'human', dim: true},
          ]}
        />
      </div>
    </div>
  );
};
