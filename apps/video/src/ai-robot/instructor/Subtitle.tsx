/**
 * KaraokeSubtitle — words write themselves AND the currently-spoken
 * word glows. `audioSec` = measured narration length for the scene.
 */
export const KaraokeSubtitle: React.FC<{text: string; local: number; audioSec: number}> = ({
  text,
  local,
  audioSec,
}) => {
  const words = text.split(' ');
  const spoken = Math.min(
    words.length,
    Math.max(1, Math.floor(((local / 30) / Math.max(0.1, audioSec)) * words.length) + 1)
  );
  const done = spoken >= words.length;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, bottom: 48, textAlign: 'center'}}>
      <div
        style={{
          display: 'inline-block',
          padding: '12px 22px',
          borderRadius: 12,
          background: 'rgba(5,8,18,0.78)',
          border: '1px solid rgba(84,224,239,0.22)',
          color: '#E8F0FA',
          fontSize: 19,
          lineHeight: 1.5,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {words.slice(0, spoken).map((w, i) => (
          <span
            key={i}
            style={
              i === spoken - 1 && !done
                ? {color: '#ffd24d', fontWeight: 800, textShadow: '0 0 14px rgba(255,210,77,0.8)'}
                : {}
            }
          >
            {w}
            {i < spoken - 1 ? ' ' : ''}
          </span>
        ))}
        {!done && <span style={{opacity: 0.55}}>▌</span>}
      </div>
    </div>
  );
};
export const TypewriterSubtitle: React.FC<{text: string; local: number; duration: number}> = ({
  text,
  local,
  duration,
}) => {
  const words = text.split(' ');
  const shown = Math.min(
    words.length,
    Math.max(1, Math.floor((local / Math.max(1, duration)) * (words.length + 1.5)))
  );
  const done = shown >= words.length;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 48,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '12px 22px',
          borderRadius: 12,
          background: 'rgba(5,8,18,0.72)',
          border: '1px solid rgba(84,224,239,0.18)',
          color: '#E8F0FA',
          fontSize: 19,
          lineHeight: 1.4,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {words.slice(0, shown).join(' ')}
        {!done && <span style={{opacity: 0.55}}>▌</span>}
      </div>
    </div>
  );
};
export const Subtitle: React.FC<{text: string; frame?: number; opacity?: number}> = ({
  text,
  frame = 0,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      right: 60,
      bottom: 48,
      textAlign: 'center',
      opacity,
    }}
  >
    <div
      style={{
        display: 'inline-block',
        padding: '12px 22px',
        borderRadius: 12,
        background: 'rgba(5,8,18,0.72)',
        border: '1px solid rgba(84,224,239,0.18)',
        color: '#E8F0FA',
        fontSize: 19,
        lineHeight: 1.4,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {text}
    </div>
  </div>
);
