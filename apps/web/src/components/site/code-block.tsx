'use client';

/**
 * Code block for article bodies: a header strip with the language, a copy
 * button, and lightweight colouring for the languages these posts actually use
 * (shell, Dockerfile, YAML, nginx, JSON). Deliberately dependency-free — the
 * stored content only needs a handful of token types, so a small scanner beats
 * pulling a highlighter library into the bundle.
 */

import { useState } from 'react';

const KEYWORDS = new Set([
  'FROM', 'RUN', 'CMD', 'ENTRYPOINT', 'COPY', 'ADD', 'WORKDIR', 'ENV', 'EXPOSE',
  'VOLUME', 'USER', 'ARG', 'LABEL', 'HEALTHCHECK', 'ONBUILD', 'STOPSIGNAL',
  'docker', 'docker-compose', 'kubectl', 'helm', 'terraform', 'git', 'npm',
  'pnpm', 'yarn', 'systemctl', 'sudo', 'apt', 'apk', 'curl', 'wget', 'echo',
  'export', 'cd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'sed', 'awk',
  'true', 'false', 'null', 'services', 'volumes', 'networks', 'version',
  'apiVersion', 'kind', 'metadata', 'spec', 'server', 'location', 'proxy_pass',
  'upstream', 'listen', 'root', 'index',
]);

type Tok = { text: string; cls: string | null };

const RULES: { re: RegExp; cls: string }[] = [
  { re: /^#[^\n]*/, cls: 'cb-com' },                                        // shell / yaml comment
  { re: /^\/\/[^\n]*/, cls: 'cb-com' },                                      // json / js comment
  { re: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/, cls: 'cb-str' },            // string
  { re: /^\$\{?[A-Za-z_][A-Za-z0-9_]*\}?|^\$[0-9]/, cls: 'cb-var' },         // shell variable
  { re: /^--?[A-Za-z][\w-]*/, cls: 'cb-flag' },                              // cli flag
  { re: /^https?:\/\/[^\s'"]+/, cls: 'cb-flag' },                            // url
  { re: /^\d+(?:\.\d+)*/, cls: 'cb-num' },                                   // number
  { re: /^[A-Za-z_][\w.-]*/, cls: 'cb-word' },                               // word (keyword check below)
];

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  let rest = line;

  while (rest.length > 0) {
    let matched = false;
    for (const rule of RULES) {
      const m = rest.match(rule.re);
      if (!m || m[0].length === 0) continue;
      const text = m[0];
      let cls: string | null = rule.cls;
      if (cls === 'cb-word') {
        cls = KEYWORDS.has(text)
          ? 'cb-kw'
          : /^[a-z][\w-]*:/.test(text) || /^[A-Za-z_][\w.-]*:\s*$/.test(text)
            ? 'cb-key'
            : null;
      }
      out.push({ text, cls });
      rest = rest.slice(text.length);
      matched = true;
      break;
    }
    if (!matched) {
      out.push({ text: rest[0], cls: null });
      rest = rest.slice(1);
    }
  }
  return out;
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the code is still selectable */
    }
  };

  const lines = code.replace(/\n$/, '').split('\n');

  return (
    <div className="cb">
      <div className="cb-head">
        <span className="cb-lang">{lang || 'code'}</span>
        <button type="button" onClick={copy} className="cb-copy">
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="cb-pre">
        <code>
          {lines.map((line, i) => (
            <span className="cb-line" key={i}>
              {tokenize(line).map((t, j) =>
                t.cls ? (
                  <span className={t.cls} key={j}>{t.text}</span>
                ) : (
                  <span key={j}>{t.text}</span>
                ),
              )}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
