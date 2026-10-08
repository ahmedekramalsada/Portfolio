/**
 * AiRobotOriginal.tsx — the downloaded animation, untouched.
 */
import {Lottie} from '@remotion/lottie';
import robotData from './ai-robot.json';

export const AiRobotOriginal: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #131A33 0%, #0A0D1D 100%)',
    }}
  >
    <Lottie animationData={robotData} loop style={{width: '100%', height: '100%'}} />
  </div>
);
