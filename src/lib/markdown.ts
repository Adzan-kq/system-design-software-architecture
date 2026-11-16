import 'server-only';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import type { Element, ElementContent, Root } from 'hast';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { createHighlighter } from 'shiki';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export type Heading = { id: string; text: string; depth: 2 | 3 };
export type RenderedMarkdown = { html: string; headings: Heading[] };

/**
 * Markdown → HTML, used for public notes and the admin live preview.
 *  - GFM (tables, task lists, strikethrough)
 *  - heading ids + extracted h2/h3 table of contents
 *  - ```mermaid blocks → <figure class="mermaid-diagram"> (rendered client-side)
 *  - everything else → Shiki, dual light/dark theme via CSS variables
 * Raw HTML in Markdown is NOT rendered (remark-rehype default), so notes can't inject scripts.
 */

// One highlighter per server process; grammars load lazily on first use.
let highlighter: ReturnType<typeof createHighlighter> | undefined;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: ['github-light', 'github-dark-dimmed'], langs: ['text'] }));

const textOf = (node: ElementContent): string =>
  node.type === 'text' ? node.value : 'children' in node ? node.children.map(textOf).join('') : '';

/** Turn ```mermaid code blocks into figures before Shiki sees them. */
function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = node.children[0];
      if (code?.type !== 'element' || code.tagName !== 'code') return;
      const classes = (code.properties.className as string[] | undefined) ?? [];
      if (!classes.includes('language-mermaid')) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['mermaid-diagram', 'not-prose'], dataMermaid: '' },
        children: [{ type: 'text', value: textOf(code).trim() }],
      };
    });
  };
}

/** Collect h2/h3 (after rehype-slug assigned ids) for the table of contents. */
function rehypeCollectHeadings(out: Heading[]) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if ((node.tagName === 'h2' || node.tagName === 'h3') && typeof node.properties.id === 'string') {
        out.push({ id: node.properties.id, text: node.children.map(textOf).join(''), depth: node.tagName === 'h2' ? 2 : 3 });
      }
    });
  };
}

export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeCollectHeadings(headings))
    .use(rehypeMermaid)
    .use(rehypeShikiFromHighlighter, await getHighlighter(), {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      lazy: true,
      fallbackLanguage: 'text',
      addLanguageClass: true,
    })
    .use(rehypeStringify)
    .process(markdown);

  return { html: String(file), headings };
}
