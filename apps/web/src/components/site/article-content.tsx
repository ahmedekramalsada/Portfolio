/**
 * Renders a stored article body. The stored format is the small subset of
 * markdown the admin editor writes: headings, bullet lists, fenced code blocks,
 * inline code and bold text. All styling lives in the `.article` class, so the
 * markup here stays plain.
 */

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) headings.push({ level: match[1].length, text: match[2].trim(), id: slugify(match[2].trim()) });
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

export function ArticleContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCode = false;

  const flushList = (key: number | string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`list-${key}`}>
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  content.split('\n').forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        blocks.push(
          <pre key={`code-${i}`}>
            <code>{code.join('\n')}</code>
          </pre>,
        );
        code = [];
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
      const id = slugify(text);
      const level = heading[1].length;
      if (level === 1) blocks.push(<h1 key={i} id={id}>{text}</h1>);
      else if (level === 2) blocks.push(<h2 key={i} id={id}>{text}</h2>);
      else blocks.push(<h3 key={i} id={id}>{text}</h3>);
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ''));
      return;
    }

    flushList(i);
    if (!line.trim()) return;              // paragraphs are spaced by CSS, no filler breaks
    blocks.push(<p key={i}>{inline(line)}</p>);
  });

  flushList('end');
  if (inCode && code.length > 0) {
    blocks.push(
      <pre key="tail">
        <code>{code.join('\n')}</code>
      </pre>,
    );
  }

  return <>{blocks}</>;
}
