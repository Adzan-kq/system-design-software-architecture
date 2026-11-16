'use client';

import { Code2, Columns2, Eye, PencilLine, Workflow } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { previewMarkdown } from '@/actions/modules';
import { MermaidRenderer } from '../markdown/MermaidRenderer';

type Mode = 'write' | 'split' | 'preview';

const SNIPPETS = {
  code: '\n```ts\n// code here\n```\n',
  mermaid: '\n```mermaid\nflowchart LR\n  Client --> API[API Gateway]\n  API --> Service\n  Service --> DB[(Database)]\n```\n',
};

/**
 * Markdown textarea with a live preview rendered by the SAME server pipeline
 * as the public page (Shiki + Mermaid), so what you see is what gets published.
 */
export function MarkdownEditor({ name, defaultValue = '' }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<Mode>('split');
  const [html, setHtml] = useState('');
  const [version, setVersion] = useState(0);
  const [pending, startTransition] = useTransition();
  const textarea = useRef<HTMLTextAreaElement>(null);

  // Debounced preview render.
  useEffect(() => {
    if (mode === 'write') return;
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await previewMarkdown(value);
        setHtml(res.html);
        setVersion((v) => v + 1);
      });
    }, 350);
    return () => clearTimeout(t);
  }, [value, mode]);

  function insert(snippet: string) {
    const el = textarea.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = value.slice(0, s) + snippet + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = s + snippet.length;
    });
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const modeButton = (m: Mode, label: string, Icon: typeof Eye, extra = '') => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        mode === m ? 'bg-card text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
      } ${extra}`}
    >
      <Icon className="size-3.5" aria-hidden /> {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-subtle/60 px-3 py-2">
        <div className="flex rounded-lg bg-subtle p-0.5">
          {modeButton('write', 'Write', PencilLine)}
          {modeButton('split', 'Split', Columns2, 'hidden lg:inline-flex')}
          {modeButton('preview', 'Preview', Eye)}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => insert(SNIPPETS.code)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-muted hover:bg-card hover:text-ink">
            <Code2 className="size-3.5" aria-hidden /> Code
          </button>
          <button type="button" onClick={() => insert(SNIPPETS.mermaid)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-muted hover:bg-card hover:text-ink">
            <Workflow className="size-3.5" aria-hidden /> Diagram
          </button>
        </div>
      </div>

      <div className={`grid ${mode === 'split' ? 'lg:grid-cols-2' : ''}`}>
        <textarea
          ref={textarea}
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Tab inserts two spaces instead of leaving the field.
            if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault();
              insert('  ');
            }
            // ⌘/Ctrl+S submits the form.
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          spellCheck
          placeholder={'## Overview\n\nWrite your study notes in Markdown…'}
          className={`min-h-[28rem] w-full resize-y bg-transparent p-4 font-mono [font-variant-ligatures:none] text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink-subtle ${
            mode === 'preview' ? 'hidden' : ''
          } ${mode === 'split' ? 'lg:border-r lg:border-line' : ''}`}
        />
        {mode !== 'write' && (
          <div className={`relative max-h-[40rem] min-h-[28rem] overflow-y-auto p-5 ${mode === 'split' ? 'hidden lg:block' : ''}`}>
            {pending && <span className="absolute top-3 right-4 text-[11px] text-ink-subtle">Rendering…</span>}
            {value.trim() ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-ink-subtle italic">Nothing to preview yet.</p>
            )}
            <MermaidRenderer version={version} />
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-line px-4 py-1.5 font-mono text-[11px] text-ink-subtle">
        <span>Markdown · GFM · ```mermaid diagrams</span>
        <span>
          {words} words · ~{Math.max(words ? 1 : 0, Math.round(words / 200))} min · ⌘S to save
        </span>
      </div>
    </div>
  );
}
