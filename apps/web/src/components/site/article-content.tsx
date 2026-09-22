/**
 * Renders a stored article body. The stored format is the small subset of
 * markdown the admin editor writes: headings, bullet and numbered lists, fenced
 * code blocks, blockquotes, inline code and bold text. Styling lives in the
 * `.article` class (and `.cb-*` for code), so the markup here stays plain.
 */

import { CodeBlock } from './code-block';

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * Heading anchors must match between the table of contents and the body.
 * Arabic and other non-Latin headings slugify to an empty string, which would
 * make every link in "on this page" point at nothing, so those fall back to a
 * stable position-based id.
 */
function headingId(text: string, index: number) {
  return slugify(text) || `section-${index}`;
}

export function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  let index = 0;
  for (const line of content.split('\n')) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (!match) continue;
    const text = match[2].trim();
    headings.push({ level: match[1].length, text, id: headingId(text, index) });
    index += 1;
  }
  return headings;
}

/** Inline code and bold, without pulling in a markdown library. */
function inline(text: string) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      return <span key={i}>{part}</span>;
    });
}

type Props = {
  content: string;
  /** The page already prints this as the article title — drop a leading repeat. */
  muteHeading?: string;
};

export function ArticleContent({ content, muteHeading }: Props) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;
  let code: string[] = [];
  let lang: string | undefined;
  let inCode = false;
  let firstHeadingSeen = false;
  let headingIndex = 0;

  const flushList = (key: number | string) => {
    if (list.length === 0) return;
    blocks.push(
      ordered ? (
        <ol key={`list-${key}`}>
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ol>
      ) : (
        <ul key={`list-${key}`}>
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>
      ),
    );
    list = [];
  };

  content.split('\n').forEach((line, i) => {
    const fence = line.trim().match(/^```(\w+)?/);
    if (fence) {
      if (inCode) {
        blocks.push(<CodeBlock key={`code-${i}`} code={code.join('\n')} lang={lang} />);
        code = [];
        lang = undefined;
      } else {
        lang = fence[1];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)/);
    if (heading) {
      flushList(i);
      const text = heading[2].trim();
      const level = heading[1].length;
      const id = headingId(text, headingIndex);
      headingIndex += 1;
      // The page prints the title itself. A body that opens with an h1 naming
      // the same article would show it twice, so drop a leading heading that
      // repeats the title or is a shortened form of it.
      const norm = (s: string) => s.toLowerCase().replace(/[\s:—–-]+/g, ' ').trim();
      const h1str = norm(text);
      const tstr = norm(muteHeading || '');
      const repeats = !firstHeadingSeen && level === 1 && tstr.length > 0 &&
        (h1str === tstr || tstr.startsWith(h1str) || h1str.startsWith(tstr));
      firstHeadingSeen = true;
      if (repeats) return;
      if (level === 1) blocks.push(<h2 key={i} id={id}>{text}</h2>);
      else if (level === 2) blocks.push(<h2 key={i} id={id}>{text}</h2>);
      else blocks.push(<h3 key={i} id={id}>{text}</h3>);
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      if (ordered) flushList(`o-${i}`);
      ordered = false;
      list.push(line.replace(/^[-*]\s+/, ''));
      return;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      if (!ordered) flushList(`u-${i}`);
      ordered = true;
      list.push(line.replace(/^\d+[.)]\s+/, ''));
      return;
    }

    if (/^>\s?/.test(line)) {
      flushList(i);
      blocks.push(
        <blockquote key={i}>{inline(line.replace(/^>\s?/, ''))}</blockquote>,
      );
      return;
    }

    if (/^(---|\*\*\*)\s*$/.test(line.trim())) {
      flushList(i);
      blocks.push(<hr key={i} />);
      return;
    }

    flushList(i);
    if (!line.trim()) return;              // paragraphs are spaced by CSS, no filler breaks
    blocks.push(<p key={i}>{inline(line)}</p>);
  });

  flushList('end');
  if (inCode && code.length > 0) {
    blocks.push(<CodeBlock key="tail" code={code.join('\n')} lang={lang} />);
  }

  return <>{blocks}</>;
}
