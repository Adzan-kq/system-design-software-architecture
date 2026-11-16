'use client';

import { useEffect } from 'react';

// Palette mirrors the design tokens in globals.css.
const THEMES = {
  light: {
    background: '#ffffff',
    primaryColor: '#f0fdfa',
    primaryBorderColor: '#0d9488',
    primaryTextColor: '#1c1917',
    secondaryColor: '#f5f5f4',
    tertiaryColor: '#fafaf9',
    lineColor: '#78716c',
    textColor: '#44403c',
    noteBkgColor: '#fef3c7',
    noteBorderColor: '#d97706',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    background: '#1e293b',
    primaryColor: '#134e4a',
    primaryBorderColor: '#2dd4bf',
    primaryTextColor: '#f8fafc',
    secondaryColor: '#334155',
    tertiaryColor: '#1e293b',
    lineColor: '#94a3b8',
    textColor: '#cbd5e1',
    noteBkgColor: '#422006',
    noteBorderColor: '#f59e0b',
    edgeLabelBackground: '#1e293b',
  },
};

let renderCount = 0;

/**
 * Renders every `figure[data-mermaid]` on the page (produced by src/lib/markdown.ts).
 * Mermaid is loaded lazily, only when a diagram exists. Re-renders on theme change,
 * and whenever `version` changes (used by the admin live preview).
 */
export function MermaidRenderer({ version }: { version?: string | number }) {
  useEffect(() => {
    const figures = [...document.querySelectorAll<HTMLElement>('figure[data-mermaid]')];
    if (figures.length === 0) return;

    for (const f of figures) f.dataset.source ??= f.textContent ?? '';
    let cancelled = false;

    const render = async () => {
      const { default: mermaid } = await import('mermaid');
      const dark = document.documentElement.classList.contains('dark');
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
        themeVariables: { ...(dark ? THEMES.dark : THEMES.light), fontSize: '15px' },
        flowchart: { curve: 'basis', padding: 16 },
      });
      for (const el of figures) {
        if (cancelled || !el.isConnected) return;
        try {
          const { svg } = await mermaid.render(`mermaid-${++renderCount}`, el.dataset.source!);
          el.innerHTML = svg;
          el.dataset.rendered = '';
        } catch (err) {
          el.textContent = `Mermaid error: ${(err as Error).message}\n\n${el.dataset.source}`;
          delete el.dataset.rendered;
        }
      }
    };

    render();
    window.addEventListener('themechange', render);
    return () => {
      cancelled = true;
      window.removeEventListener('themechange', render);
    };
  }, [version]);

  return null;
}
