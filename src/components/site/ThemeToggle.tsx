'use client';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) root.classList.add('theme-transition');

    const dark = root.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
    // Lets Mermaid diagrams re-theme themselves.
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));

    if (!reduce) setTimeout(() => root.classList.remove('theme-transition'), 350);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative grid size-9 place-items-center overflow-hidden rounded-lg text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      <Sun className="absolute size-5 scale-50 rotate-90 opacity-0 transition-all duration-500 dark:scale-100 dark:rotate-0 dark:opacity-100" aria-hidden />
      <Moon className="absolute size-5 transition-all duration-500 dark:scale-50 dark:-rotate-90 dark:opacity-0" aria-hidden />
    </button>
  );
}
