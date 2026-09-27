'use client';

import { useEffect, useRef, useState } from 'react';

export type PipelineStage = {
  title: string;
  body: string;
  command: string;
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

// commit · quality gate · image · delivery · verify · watch
const ICONS = [
  'M7 1.5v2.6M7 9.9v2.6M1.5 7h2.6M9.9 7h2.6M7 5.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z',
  'M7 1.3 11.7 3v3.4c0 2.9-2 4.6-4.7 5.8-2.7-1.2-4.7-2.9-4.7-5.8V3Zm-2.1 4.9 1.5 1.5 2.7-2.9',
  'M7 1.6 12.2 4.4v5.2L7 12.4 1.8 9.6V4.4Zm-5.2 2.8L7 9.8l5.2-2.6M7 9.8v2.4',
  'M3.6 9.6a2.4 2.4 0 0 1 .4-4.7 3.1 3.1 0 0 1 6 .6 2.2 2.2 0 0 1-.4 4.1ZM7 12.6v-3.4M5.5 10.4 7 8.9l1.5 1.5',
  'M11.7 4.6A4.6 4.6 0 0 0 3 6.2M2.3 9.4a4.6 4.6 0 0 0 8.7-1.6M11.7 2.2v2.4H9.3M2.3 11.8V9.4h2.4',
  'M1.5 7S3.4 3.7 7 3.7 12.5 7 12.5 7 10.6 10.3 7 10.3 1.5 7 1.5 7Zm5.5-1.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z',
];

/**
 * The path a change takes to production: bubble cards alternate left and
 * right of a clear wire. The wire is drawn through the real badge centers
 * after layout, so it always passes through every step and weaves
 * left-right between them. Scrolling lights the wire and each card;
 * clicking a card jumps to it. On a phone it is one column, wire on left.
 */
export function Pipeline({ stages }: { stages: PipelineStage[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const progRef = useRef<SVGPathElement>(null);
  const stubsRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const lenRef = useRef(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const prog = progRef.current;
    if (!wrap || !track || !prog) return;

    const build = () => {
      const box = wrap.getBoundingClientRect();
      const W = box.width;
      const track = trackRef.current;
      const prog = progRef.current;
      const stubs = stubsRef.current;
      const nodes = nodesRef.current;
      if (!track || !prog) return;
      let d = '';
      let stubD = '';
      if (W < 600) {
        // Phone: straight spine through the badge centers in the gutter.
        const dots = Array.from(wrap.querySelectorAll('.sdot'));
        if (dots.length === 0) return;
        const pts = dots.map((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
        });
        const x = pts[0].x;
        d = `M ${x} ${Math.max(0, pts[0].y - 30)} L ${x} ${pts[pts.length - 1].y + 30}`;
      } else {
        // Desktop: straight center spine, short branch stubs to each card.
        const cards = Array.from(wrap.querySelectorAll('.scard'));
        if (cards.length === 0) return;
        const cx = W / 2;
        const info = cards.map((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return { cy: r.top + r.height / 2 - box.top, top: r.top - box.top, bottom: r.bottom - box.top, left: r.left - box.left, right: r.right - box.left };
        });
        d = `M ${cx} ${Math.max(0, info[0].top - 24)} L ${cx} ${info[info.length - 1].bottom + 24}`;
        stubD = info
          .map((c) => {
            const inner = c.left + (c.right - c.left) / 2 > cx ? c.left : c.right;
            return `M ${cx} ${c.cy} L ${inner} ${c.cy}`;
          })
          .join(' ');
        if (nodes) {
          Array.from(nodes.children).forEach((c, i) => {
            if (i < info.length) {
              (c as SVGCircleElement).setAttribute('cx', String(cx));
              (c as SVGCircleElement).setAttribute('cy', String(info[i].cy));
            }
          });
        }
      }
      if (stubs) stubs.setAttribute('d', stubD);
      track.setAttribute('d', d);
      prog.setAttribute('d', d);
      const total = prog.getTotalLength();
      lenRef.current = total;
      prog.style.strokeDasharray = String(total);
      update();
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const span = rect.height - window.innerHeight * 0.35;
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - rect.top) / Math.max(1, span)));

      if (progRef.current) progRef.current.style.strokeDashoffset = String(lenRef.current * (1 - progress));
      const idx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      setActive(idx);
      const g = nodesRef.current;
      if (g) {
        Array.from(g.children).forEach((c, i) => {
          (c as SVGCircleElement).setAttribute('class', `snode${i <= idx ? ' on' : ''}`);
        });
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const onResize = () => build();
    build();
    const raf = requestAnimationFrame(build);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stages.length]);

  return (
    <div ref={wrapRef} className="snake mt-11">
      <svg className="swave" aria-hidden>
        <defs>
          <linearGradient id="swg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#68c295" />
            <stop offset="1" stopColor="#e7a95e" />
          </linearGradient>
        </defs>
        <path ref={trackRef} className="swave-track" d="" />
        <path ref={progRef} className="swave-prog" d="" />
        <path ref={stubsRef} className="swave-stub" d="" />
        <g ref={nodesRef}>
          {stages.map((stage) => (
            <circle key={stage.title} className="snode" r={5} cx={-20} cy={-20} />
          ))}
        </g>
      </svg>

      {stages.map((stage, index) => (
        <div
          key={stage.title}
          className={`srow ${index % 2 === 1 ? 'flip' : ''} ${index <= active ? 'is-on' : ''}`}
          onClick={() => setActive(index)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setActive(index);
          }}
        >
          <span className="sdot">
            <Icon d={ICONS[index % ICONS.length]} />
          </span>
          <div className="scard">
            <span className="snum">
              {String(index + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
            </span>
            <h3 className="mt-2 text-[19px] font-medium tracking-[-.018em]">{stage.title}</h3>
            <p className="mt-2 max-w-[46ch] text-[14.2px] text-muted-foreground">{stage.body}</p>
            <code>{stage.command}</code>
          </div>
        </div>
      ))}
    </div>
  );
}
