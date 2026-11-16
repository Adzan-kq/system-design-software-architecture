'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home', match: (p: string) => p === '/', desktopOnly: true },
  { href: '/#pillars', label: 'Pillars', match: (p: string) => p.startsWith('/pillars') },
  { href: '/journey', label: 'Journey', match: (p: string) => p.startsWith('/journey') },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="ml-auto flex items-center gap-0.5 sm:gap-1" aria-label="Main">
      {LINKS.map((l) => {
        const active = l.match(pathname);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3',
              l.desktopOnly ? 'hidden sm:block' : '',
              active ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-subtle hover:text-ink',
            ].join(' ')}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
