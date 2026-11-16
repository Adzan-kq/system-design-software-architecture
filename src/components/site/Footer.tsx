import Link from 'next/link';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{SITE.author}. Learning in public, one module at a time.</p>
        <nav className="flex gap-5" aria-label="Footer">
          <Link href="/#pillars" className="transition-colors hover:text-accent">Pillars</Link>
          <Link href="/journey" className="transition-colors hover:text-accent">Journey</Link>
          <a href={SITE.repo} target="_blank" rel="noopener" className="transition-colors hover:text-accent">GitHub ↗</a>
        </nav>
      </div>
    </footer>
  );
}
