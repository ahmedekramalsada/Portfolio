'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const WORDS = ['Pushing commit…', 'Building · 25 pages…', 'Running final verification…', 'Deploying to edge…'];
const LOOP = 2200;
const LIVE_AT = 0.78;

const ICONS = [
  <svg key="c" viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="8" r="2.4" /><path d="M6 8.4v7.2M18 10.4c0 4-5 3.6-8.5 3.6" /></svg>,
  <svg key="b" viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.6 5L4 16.4V20h3.6l4.9-4.9a4 4 0 0 0 5-5.6l-2.8 2.8-2.5-.7-.7-2.5z" /></svg>,
  <svg key="t" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4.5" /></svg>,
  <svg key="d" viewBox="0 0 24 24"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-2 7-2 7-2s0 4-2 7l-7 7-5-5z" /><circle cx="15" cy="9" r="1.6" /></svg>,
];
const LABELS = ['commit', 'build', 'test', 'deploy'];

export function DeployLoader() {
  const pathname = usePathname();
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const p = (performance.now() - t0) / LOOP;
      const track = trackRef.current;
      if (!track) return;
      const tLeft = track.offsetLeft;
      const span = track.offsetWidth;
      const tTop = track.offsetTop;
      const fill = fillRef.current!;
      const head = headRef.current!;
      fill.style.left = `${tLeft}px`;
      fill.style.top = `${tTop}px`;
      head.style.top = `${tTop}px`;
      if (p >= LIVE_AT) {
        const lp = (p - LIVE_AT) / (1 - LIVE_AT);
        fill.style.width = `${span}px`;
        head.style.left = `${tLeft + span}px`;
        barFillRef.current!.style.width = '100%';
        stageRefs.current.forEach((s) => {
          s?.classList.add('done');
          s?.classList.remove('on');
        });
        msgRef.current!.innerHTML = '<span class="dload-ok">✓ live — ahmedekram.site</span>';
        barRef.current!.classList.add('live');
        if (lp > 0.72 && overlayRef.current) {
          overlayRef.current.style.opacity = String(Math.max(0, 1 - (lp - 0.72) / 0.28));
        }
        if (p >= 1) {
          setFading(true);
          window.setTimeout(() => setGone(true), 120);
          return;
        }
      } else {
        const q = p / LIVE_AT;
        const idx = Math.min(3, Math.floor(q * 4));
        fill.style.width = `${span * q}px`;
        head.style.left = `${tLeft + span * q}px`;
        barFillRef.current!.style.width = `${q * 100}%`;
        stageRefs.current.forEach((s, i) => {
          s?.classList.toggle('done', i < idx);
          s?.classList.toggle('on', i === idx);
        });
        if (msgRef.current) msgRef.current.textContent = WORDS[idx];
        barRef.current!.classList.remove('live');
        if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(1, p / 0.04));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone || pathname === '/login' || pathname?.startsWith('/dashboard')) return null;

  return (
    <div ref={overlayRef} className={`dload-overlay${fading ? ' dload-gone' : ''}`} aria-hidden="true">
      <div className="dload-card">
        <div className="dload-top"><span><span className="dload-dot" />Deploying</span><span>ahmedekram.site</span></div>
        <div className="dload-pipe">
          <div ref={trackRef} className="dload-track" />
          <div ref={fillRef} className="dload-fill" />
          <div ref={headRef} className="dload-head" />
          {ICONS.map((icon, i) => (
            <div key={LABELS[i]} ref={(el) => { stageRefs.current[i] = el; }} className="dload-st">
              <span className="dload-node">{icon}</span>
              <span className="dload-lbl">{LABELS[i]}</span>
            </div>
          ))}
        </div>
        <div ref={msgRef} className="dload-status">…</div>
        <div ref={barRef} className="dload-bar"><i ref={barFillRef} /></div>
      </div>
    </div>
  );
}
