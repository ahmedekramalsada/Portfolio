'use client';

import { useRef } from 'react';

export type TerminalData = {
  name: string;
  role: string;
  location: string;
  focus: string;
  skills: string[];
  projects: { title: string; stack: string[] }[];
  posts: { title: string; date: string; tags: string[] }[];
  contact: { email: string; github: string; linkedin: string };
};

type Line = { html: string };

const CHIPS = [
  ['whoami', 'whoami'],
  ['stack', 'stack'],
  ['projects', 'projects'],
  ['writing', 'writing'],
  ['how', 'how it ships'],
  ['contact', 'contact'],
] as const;

/**
 * A small shell you can actually type into. Every answer comes from real data
 * passed in from the server — nothing here invents a number or a claim.
 */
export function Terminal({ data }: { data: TerminalData }) {
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const write = (html: string) => {
    const out = outRef.current;
    if (!out) return;
    const div = document.createElement('div');
    div.className = 'l';
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };

  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const commands: Record<string, () => void> = {
    help: () => {
      const rows: [string, string][] = [
        ['whoami', 'role and where I am'],
        ['stack', 'the tools I actually use'],
        ['projects', 'things I have shipped'],
        ['writing', 'published articles'],
        ['how', 'how a change reaches production'],
        ['contact', 'where to reach me'],
        ['clear', 'clear this screen'],
      ];
      rows.forEach(([cmd, what]) =>
        write(`<span class="a">${cmd.padEnd(9, '\u00a0')}</span> <span class="d">— ${what}</span>`),
      );
    },
    whoami: () => {
      write(`<span class="g">${escape(data.name)}</span> — ${escape(data.role)}, ${escape(data.location)}.`);
      write(`<span class="d">Focus: ${escape(data.focus)}</span>`);
    },
    stack: () => {
      const skills = data.skills;
      for (let i = 0; i < skills.length; i += 4) {
        write(`<span class="b">${escape(skills.slice(i, i + 4).join(' · '))}</span>`);
      }
    },
    projects: () => {
      data.projects.forEach((project, index) => {
        write(
          `<span class="a">${String(index + 1).padStart(2, '0')}</span> ${escape(project.title)}` +
            (project.stack.length ? ` <span class="d">${escape(project.stack.join(' · ').toLowerCase())}</span>` : ''),
        );
      });
      write('<span class="d">scroll down to open any of them</span>');
    },
    writing: () => {
      data.posts.forEach((post) => {
        write(`<span class="a">${escape(post.date)}</span> ${escape(post.title)}`);
      });
    },
    how: () => {
      write('commit → build → test → <span class="b">deploy the idle side</span> → health check → <span class="b">move traffic</span> → watch → rollback ready');
      write('<span class="d">Nothing receives traffic before it has passed its own health check.</span>');
    },
    contact: () => {
      write(
        `Email <span class="a">${escape(data.contact.email)}</span> · GitHub <span class="a">${escape(data.contact.github)}</span> · LinkedIn <span class="a">${escape(data.contact.linkedin)}</span>`,
      );
    },
    clear: () => {
      if (outRef.current) outRef.current.innerHTML = '';
    },
    ls: () => write('<span class="b">writing/</span>  <span class="b">projects/</span>  <span class="b">about/</span>  <span class="b">resume/</span>  <span class="b">contact/</span>'),
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    write(`<span class="d">➜</span> ${escape(raw)}`);
    if (!cmd) return;
    if (commands[cmd]) commands[cmd]();
    else write(`<span class="d">unknown command: ${escape(cmd)} — try</span> <span class="a">help</span>`);
  };

  return (
    <div className="term">
      <div className="flex items-center gap-3 border-b border-line bg-muted px-4 py-3">
        <span className="flex gap-1.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-line-2" />
          <i className="block h-2.5 w-2.5 rounded-full bg-line-2" />
          <i className="block h-2.5 w-2.5 rounded-full bg-line-2" />
        </span>
        <span className="font-mono text-[11px] tracking-[.08em] text-muted-foreground">ahmed@ahmed-os · ~</span>
      </div>

      {/* The opening line is rendered by the server, so this is never an empty
          box before JavaScript runs. Typed commands append below it. */}
      <div ref={outRef} className="term-body" aria-live="polite">
        <div className="l">
          <span className="d">{data.name} shell · type</span> <span className="a">help</span>{' '}
          <span className="d">and press enter</span>
        </div>
        <div className="l">
          <span className="d">try</span> <span className="a">whoami</span>{' '}
          <span className="d">·</span> <span className="a">stack</span>{' '}
          <span className="d">·</span> <span className="a">projects</span>
        </div>
      </div>

      <div className="term-input" onClick={() => inputRef.current?.focus()}>
        <span>➜</span>
        <input
          ref={inputRef}
          className="min-h-[28px]"
          aria-label="Terminal command"
          autoComplete="off"
          spellCheck={false}
          placeholder="type help and press enter"
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            const value = event.currentTarget.value;
            event.currentTarget.value = '';
            run(value);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2.5 border-t border-line px-4 py-4">
        {CHIPS.map(([cmd, text]) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              run(cmd);
              inputRef.current?.focus();
            }}
            className="inline-flex min-h-[40px] items-center rounded-full border border-line-2 bg-background/70 px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[.07em] text-muted-foreground transition hover:border-warm hover:text-foreground"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
