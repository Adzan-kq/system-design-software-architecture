import Link from 'next/link';
import { Suspense } from 'react';
import { SITE } from '@/lib/site';
import { GitHubIcon } from './GitHubIcon';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

/** Sticky glassmorphism navbar: brand · links · GitHub · theme toggle. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 rounded-lg font-display text-lg font-extrabold tracking-tight">
          <span
            className="grid size-8 place-items-center rounded-xl bg-accent text-sm text-accent-contrast shadow-sm transition-transform group-hover:-rotate-6"
            aria-hidden
          >
            A
          </span>
          <span>
            Adzan<span className="text-accent">.dev</span>
          </span>
        </Link>

        {/* usePathname makes this request-dependent; keep the rest of the bar in the static shell. */}
        <Suspense fallback={<div className="ml-auto" />}>
          <NavLinks />
        </Suspense>

        <div className="flex items-center gap-0.5 border-l border-line pl-2 sm:ml-1 sm:pl-3">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener"
            aria-label="GitHub repository"
            className="hidden rounded-lg p-2 text-ink-muted transition-colors hover:bg-subtle hover:text-ink min-[400px]:block"
          >
            <GitHubIcon className="size-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
