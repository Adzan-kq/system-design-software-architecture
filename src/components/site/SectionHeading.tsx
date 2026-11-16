import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  link?: { href: string; label: string };
  as?: 'h1' | 'h2';
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 font-mono text-xs font-medium tracking-wider text-accent uppercase">{eyebrow}</p>}
        <Tag className={`font-bold text-ink ${Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{title}</Tag>
        {description && <p className="mt-2 text-ink-muted">{description}</p>}
      </div>
      {link && (
        <Link href={link.href} className="group inline-flex items-center gap-1 text-sm font-medium text-accent">
          {link.label}
          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </Link>
      )}
    </div>
  );
}
