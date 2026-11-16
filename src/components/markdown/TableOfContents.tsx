'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/markdown';

/** Floating "On this page" card with position-based scroll-spy. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    if (headings.length === 0) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 120) current = h.id;
        else if (el) break;
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = headings[headings.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="rounded-2xl border border-line bg-card/70 p-5 text-sm shadow-sm backdrop-blur">
      <p className="mb-3 font-mono text-[11px] font-semibold tracking-wider text-ink-subtle uppercase">On this page</p>
      <ul className="space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={[
                '-ml-px block border-l-2 py-1 leading-snug transition-colors',
                h.depth === 3 ? 'pl-6 text-[13px]' : 'pl-3',
                active === h.id ? 'border-accent font-medium text-accent' : 'border-transparent text-ink-muted hover:text-ink',
              ].join(' ')}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
