import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { NexCharacter } from './NexCharacter';
import type { NexArtwork } from './NexCharacter';

const background = '#04090f';
const cyan = '#59cfff';
const text = '#eaf6ff';
const font = 'system-ui, -apple-system, sans-serif';

// Source and rendered artwork together: judge identity before approving motion.
export function NexReferenceComparison() {
  return (
    <AbsoluteFill style={{ background, color: text, fontFamily: font, padding: 48 }}>
      <div style={{ color: cyan, fontSize: 22, letterSpacing: 4 }}>NEX / APPROVED ARTWORK CHECK</div>
      <h1 style={{ fontSize: 44, margin: '16px 0 30px' }}>Same artwork. No simplified redraw.</h1>
      <div style={{ display: 'flex', gap: 48, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 24 }}>Your original character sheet</div>
          <Img src={staticFile('nex/reference.png')} style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'contain' }} />
        </div>
        <div style={{ width: 650, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 24 }}>Reusable Remotion character / portrait</div>
          <NexCharacter artwork="portrait" style={{ flex: 1, minHeight: 0, height: 'auto' }} />
          <div style={{ fontSize: 18, color: '#a1b5c8' }}>Lossless source crop · original background retained · not a 3D rig</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CharacterShot({ artwork, title }: { artwork: NexArtwork; title: string }) {
  return (
    <AbsoluteFill style={{ background, color: text, fontFamily: font, padding: '110px 55px 160px' }}>
      <div style={{ color: cyan, letterSpacing: 8, fontSize: 28 }}>NEX / YOUR AI GUIDE</div>
      <h1 style={{ fontSize: 56, margin: '22px 0 40px' }}>{title}</h1>
      <NexCharacter artwork={artwork} motion style={{ flex: 1, minHeight: 0, height: 'auto' }} />
      <div style={{ marginTop: 40, color: '#a1b5c8', fontSize: 26 }}>Original sheet artwork · subtle panel motion</div>
    </AbsoluteFill>
  );
}

export function NexReferenceDemo() {
  return (
    <AbsoluteFill style={{ background }}>
      <Sequence from={0} durationInFrames={240}>
        <CharacterShot artwork="portrait" title="The approved identity." />
      </Sequence>
      <Sequence from={240} durationInFrames={240}>
        <CharacterShot artwork="hero" title="Armor. Core. Energy fins." />
      </Sequence>
      <Sequence from={480} durationInFrames={240}>
        <CharacterShot artwork="explain" title="Ready to explain." />
      </Sequence>
    </AbsoluteFill>
  );
}
