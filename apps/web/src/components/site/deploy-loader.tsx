'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const arabic = pathname === '/ar' || pathname?.startsWith('/ar/');

  const dismiss = () => {
    document.documentElement.classList.remove('intro-enabled');
    setGone(true);
  };

  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => {
      root.classList.remove('intro-enabled');
      setGone(true);
    };
    if (!root.classList.contains('intro-enabled') || motion.matches) {
      finish();
      return;
    }
    // The CSS animation has its own deadline even if hydration fails.
    const timeout = window.setTimeout(finish, 1800);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') finish();
    };
    const onMotion = () => { if (motion.matches) finish(); };
    window.addEventListener('keydown', onKey);
    motion.addEventListener('change', onMotion);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('keydown', onKey);
      motion.removeEventListener('change', onMotion);
      root.classList.remove('intro-enabled');
    };
  }, []);

  if (gone || pathname === '/login' || pathname?.startsWith('/dashboard')) return null;

  return (
    <div className="dload-overlay" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) dismiss();
    }}>
      <div className="dload-card">
        <div aria-hidden="true" dir="ltr">
          <div className="dload-top"><span><span className="dload-dot" />Deploying</span><span>ahmedekram.site</span></div>
          <div className="dload-pipe">
            <div className="dload-track" />
            <div className="dload-fill" />
            <div className="dload-head" />
            {ICONS.map((icon, i) => <div key={LABELS[i]} className="dload-st" style={{ '--stage-delay': `${i * 280}ms` } as React.CSSProperties}>
              <span className="dload-node">{icon}</span><span className="dload-lbl">{LABELS[i]}</span>
            </div>)}
          </div>
          <div className="dload-status">
            <span className="dload-message">{arabic ? 'من الفكرة إلى التشغيل…' : 'From commit to live…'}</span>
            <span className="dload-ok">✓ live — ahmedekram.site</span>
          </div>
          <div className="dload-bar"><i /></div>
        </div>
        <button type="button" onClick={dismiss} className="dload-skip">{arabic ? 'تخطي المقدمة' : 'Skip intro'}</button>
      </div>
    </div>
  );
}
