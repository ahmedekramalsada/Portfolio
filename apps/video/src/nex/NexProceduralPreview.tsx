import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { NexProcedural } from './NexProcedural';

// The reference image is ONLY in this comparison, never in the character.
export function NexProceduralComparison() {
  return (
    <AbsoluteFill style={{ background: '#040910', color: '#deeeff', fontFamily: 'system-ui', padding: 40 }}>
      <div style={{ fontSize: 28, color: '#71cdff', letterSpacing: 3 }}>NEX / PROCEDURAL GEOMETRY STUDY</div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 32, marginTop: 22 }}>
        <div style={{ width: 1050, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontSize: 24, marginBottom: 20 }}>Reference sheet</div>
          <Img src={staticFile('nex/reference.png')} style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ fontSize: 24 }}>Code-drawn character / no character images</div>
          <div style={{ flex: 1, minHeight: 0 }}><NexProcedural animate={false} /></div>
          <div style={{ fontSize: 18, color: '#98acc2' }}>2.5D SVG approximation — not an exact 3D match</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function NexProceduralDemo() {
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, #12273e, #03070d 70%)', color: '#d9eeff', fontFamily: 'system-ui' }}>
      <div style={{ position: 'absolute', top: 65, left: 65, color: '#6dd1ff', fontSize: 30, letterSpacing: 6 }}>NEX / CODE-DRAWN</div>
      <div style={{ position: 'absolute', inset: '120px 80px 125px' }}>
        <Sequence from={0} durationInFrames={180}><NexProcedural /></Sequence>
        <Sequence from={180} durationInFrames={180}><NexProcedural pose="explain" speaking /></Sequence>
        <Sequence from={360} durationInFrames={120}><NexProcedural pose="point" /></Sequence>
      </div>
      <div style={{ position: 'absolute', bottom: 65, left: 65, fontSize: 24, color: '#94acc5' }}>SVG geometry · jointed arms · no character images</div>
    </AbsoluteFill>
  );
}
