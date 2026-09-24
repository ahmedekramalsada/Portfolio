'use client';

import { useRef } from 'react';
import type { Locale } from '@/lib/site-content';

type TerminalData = { name: string; role: string; location: string; focus: string; skills: string[]; projects: { title: string; stack: string[] }[]; posts: { title: string; date: string; tags: string[] }[]; contact: { email: string; github: string; linkedin: string } };
type Line = { html: string };
const CHIPS = [['whoami', 'whoami'], ['stack', 'stack'], ['projects', 'projects'], ['writing', 'writing'], ['how', 'how it ships'], ['contact', 'contact']] as const;

export type { TerminalData };

export function Terminal({ data, locale = 'en' }: { data: TerminalData; locale?: Locale }) {
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ar = locale === 'ar';
  const write = (html: string) => { const out = outRef.current; if (!out) return; const div = document.createElement('div'); div.className = 'l'; div.innerHTML = html; out.appendChild(div); out.scrollTop = out.scrollHeight; };
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const commands: Record<string, () => void> = {
    help: () => { [['whoami', ar ? 'الدور والموقع' : 'role and where I am'], ['stack', ar ? 'الأدوات' : 'the tools I use'], ['projects', ar ? 'المشاريع' : 'things I have shipped'], ['writing', ar ? 'المقالات' : 'published articles'], ['how', ar ? 'رحلة التغيير للإنتاج' : 'how a change reaches production'], ['contact', ar ? 'التواصل' : 'where to reach me'], ['clear', ar ? 'مسح' : 'clear this screen']].forEach(([cmd, what]) => write(`<span class="a">${cmd.padEnd(9, '\u00a0')}</span> <span class="d">— ${what}</span>`)); },
    whoami: () => { write(`<span class="g">${escape(data.name)}</span> — ${escape(data.role)}, ${escape(data.location)}.`); write(`<span class="d">${ar ? 'التركيز' : 'Focus'}: ${escape(data.focus)}</span>`); },
    stack: () => { for (let i = 0; i < data.skills.length; i += 4) write(`<span class="b">${escape(data.skills.slice(i, i + 4).join(' · '))}</span>`); },
    projects: () => { data.projects.forEach((project, index) => write(`<span class="a">${String(index + 1).padStart(2, '0')}</span> ${escape(project.title)}${project.stack.length ? ` <span class="d">${escape(project.stack.join(' · ').toLowerCase())}</span>` : ''}`)); },
    writing: () => { data.posts.forEach((post) => write(`<span class="a">${escape(post.date)}</span> ${escape(post.title)}`)); },
    how: () => { write(ar ? 'التزام → بناء → اختبار → تشغيل النسخة الجانبية → فحص الصحة → نقل المرور → مراقبة → جاهز للتراجع' : 'commit → build → test → deploy the idle side → health check → move traffic → watch → rollback ready'); write(`<span class="d">${ar ? 'لا يستقبل أي مرور قبل نجاح فحص الصحة.' : 'Nothing receives traffic before it has passed its own health check.'}</span>`); },
    contact: () => write(`${ar ? 'البريد' : 'Email'} <span class="a">${escape(data.contact.email)}</span> · GitHub <span class="a">${escape(data.contact.github)}</span> · LinkedIn <span class="a">${escape(data.contact.linkedin)}</span>`),
    clear: () => { if (outRef.current) outRef.current.innerHTML = ''; },
    ls: () => write(`<span class="b">writing/</span>  <span class="b">projects/</span>  <span class="b">about/</span>  <span class="b">contact/</span>`),
  };
  const run = (raw: string) => { const cmd = raw.trim().toLowerCase(); write(`<span class="d">➜</span> ${escape(raw)}`); if (!cmd) return; if (commands[cmd]) commands[cmd](); else write(`<span class="d">${ar ? 'أمر غير معروف' : 'unknown command'}: ${escape(cmd)} — ${ar ? 'جرّب' : 'try'} <span class="a">help</span>`); };
  return <div className="term"><div className="flex items-center gap-3 border-b border-line bg-muted px-4 py-3"><span className="flex gap-1.5"><i className="block h-2.5 w-2.5 rounded-full bg-line-2" /><i className="block h-2.5 w-2.5 rounded-full bg-line-2" /><i className="block h-2.5 w-2.5 rounded-full bg-line-2" /></span><span className="font-mono text-[11px] tracking-[.08em] text-muted-foreground">ahmed@ahmed-os · ~</span></div><div ref={outRef} className="term-body" aria-live="polite"><div className="l"><span className="d">{data.name} shell · type</span> <span className="a">help</span> <span className="d">{ar ? 'ثم اضغط Enter' : 'and press enter'}</span></div><div className="l"><span className="d">try</span> <span className="a">whoami</span> <span className="d">·</span> <span className="a">stack</span> <span className="d">·</span> <span className="a">projects</span></div></div><div className="term-input" onClick={() => inputRef.current?.focus()}><span>➜</span><input ref={inputRef} className="min-h-[40px]" aria-label={ar ? 'أمر الطرفية' : 'Terminal command'} autoComplete="off" spellCheck={false} placeholder={ar ? 'اكتب help ثم اضغط Enter' : 'type help and press enter'} onKeyDown={(event) => { if (event.key !== 'Enter') return; const value = event.currentTarget.value; event.currentTarget.value = ''; run(value); }} /></div><div className="flex flex-wrap gap-2.5 border-t border-line px-4 py-4">{CHIPS.map(([cmd, text]) => <button key={cmd} type="button" onClick={() => { run(cmd); inputRef.current?.focus(); }} className="inline-flex min-h-[40px] items-center rounded-full border border-line-2 bg-background/70 px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[.07em] text-muted-foreground transition hover:border-warm hover:text-foreground">{ar && cmd === 'how' ? 'كيف' : text}</button>)}</div></div>;
}
