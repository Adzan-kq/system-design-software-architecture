import { MermaidRenderer } from './MermaidRenderer';

/**
 * Renders HTML produced by src/lib/markdown.ts (trusted: raw HTML in the
 * Markdown source is not passed through by the pipeline).
 */
export function Prose({ html, className = '' }: { html: string; className?: string }) {
  return (
    <>
      <div className={`prose prose-lg max-w-none prose-img:rounded-xl ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
      <MermaidRenderer />
    </>
  );
}
