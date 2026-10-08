import { AbsoluteFill } from 'remotion';
import { Core, HudFrame, J, Waveform } from './jarvis/Jarvis';

// Single-frame character showcase: the Core, speaking, in full HUD.
export function CoreStill() {
  return (
    <AbsoluteFill style={{ backgroundColor: J.bg }}>
      <HudFrame status="SYS.ONLINE // CORE.SPEAK">
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Core mode="speak" size={460} />
          <div style={{ height: 40 }} />
          <Waveform width={620} bars={30} height={100} />
          <div style={{ fontFamily: J.sans, color: J.ice, fontSize: 64, fontWeight: 800, marginTop: 44 }}>
            THE CORE
          </div>
          <div style={{ fontFamily: J.mono, color: J.dim, fontSize: 28, letterSpacing: 5, marginTop: 16 }}>
            AHMED OS // AI PRESENCE
          </div>
        </AbsoluteFill>
      </HudFrame>
    </AbsoluteFill>
  );
}
