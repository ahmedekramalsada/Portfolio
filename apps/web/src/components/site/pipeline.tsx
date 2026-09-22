'use client';

import { useEffect, useRef, useState } from 'react';

export type PipelineStage = {
  title: string;
  body: string;
  command: string;
};

/**
 * The path a change takes to production. Scrolling advances the rail and the
 * stage list; clicking a stage jumps to it. The panel on the right always
 * describes the stage that is currently lit.
 */
export function Pipeline({ stages }: { stages: PipelineStage[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight * 0.35;
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - rect.top) / Math.max(1, span)));

      if (fillRef.current) fillRef.current.style.height = `${progress * 100}%`;
      setActive(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stages.length]);

  const current = stages[active];

  return (
    <div ref={wrapRef} className="mt-11 grid items-start gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
      <div className="relative pl-9">
        <div className="rail">
          <div ref={fillRef} className="rail-fill" />
        </div>

        {stages.map((stage, index) => (
          <div
            key={stage.title}
            className={`stage ${index <= active ? 'is-on' : ''}`}
            onClick={() => setActive(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setActive(index);
            }}
          >
            <h3 className="text-[19px] font-medium tracking-[-.018em]">{stage.title}</h3>
            <p className="mt-2 max-w-[46ch] text-[14.2px] text-muted-foreground">{stage.body}</p>
            <code>{stage.command}</code>
          </div>
        ))}
      </div>

      {/* On a phone the panel would repeat the entry that is already on screen,
          so the steps stand on their own and the panel is desktop only. */}
      <aside className="panel hidden p-6 lg:sticky lg:top-28 lg:block">
        <span className="label mb-3 block">
          Step <b className="text-foreground">{String(active + 1).padStart(2, '0')}</b> of{' '}
          {String(stages.length).padStart(2, '0')}
        </span>
        <h4 className="text-xl font-medium tracking-[-.02em]">{current.title}</h4>
        <p className="mt-2.5 text-[14.4px] text-muted-foreground">{current.body}</p>
        <pre className="mt-4 whitespace-pre-wrap font-mono text-[12px] leading-[1.8] text-[#c9cfd7]">
          <span className="text-dim">$</span> {current.command}
          {'\n'}
          <span className="text-ok">✓</span> done <span className="text-dim">· logged · reversible</span>
        </pre>
      </aside>
    </div>
  );
}
