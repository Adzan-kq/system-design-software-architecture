import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Prose } from '@/components/markdown/Prose';
import { TableOfContents } from '@/components/markdown/TableOfContents';
import { StatusBadge } from '@/components/site/StatusBadge';
import { formatDate } from '@/lib/format';
import { getModulePage, getModuleSlugs } from '@/lib/queries';

export async function generateStaticParams() {
  return getModuleSlugs();
}

export async function generateMetadata({ params }: PageProps<'/pillars/[slug]/[module]'>): Promise<Metadata> {
  const { slug, module } = await params;
  const page = await getModulePage(slug, module);
  return page ? { title: page.module.title, description: page.module.summary ?? undefined } : {};
}

const DOT = { COMPLETED: 'bg-emerald-500 dark:bg-emerald-400', IN_PROGRESS: 'bg-amber-500 dark:bg-amber-400', PLANNED: 'bg-line' };

export default async function ModulePage({ params }: PageProps<'/pillars/[slug]/[module]'>) {
  const { slug, module: moduleSlug } = await params;
  const page = await getModulePage(slug, moduleSlug);
  if (!page) notFound();

  const { module, html, headings, readingTime, siblings, prev, next } = page;
  const hasNotes = module.content.trim().length > 0;

  return (
    <div className="mx-auto flex max-w-[90rem] gap-10 px-4 sm:px-6">
      {/* Pillar sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <nav aria-label={module.pillar.title} className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto py-10 text-sm">
          <Link href={`/pillars/${module.pillar.slug}`} className="mb-4 block px-2 font-mono text-[11px] font-semibold tracking-wider text-ink-subtle uppercase hover:text-accent">
            ← {module.pillar.title}
          </Link>
          <ul className="space-y-0.5">
            {siblings.map((s) => {
              const active = s.slug === module.slug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/pillars/${module.pillar.slug}/${s.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
                      active ? 'bg-accent-soft font-medium text-accent' : 'text-ink-muted hover:bg-subtle hover:text-ink'
                    }`}
                  >
                    <span className={`size-1.5 shrink-0 rounded-full ${DOT[s.status]}`} aria-hidden />
                    <span className="truncate">{s.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Reading column */}
      <main className="min-w-0 flex-1 py-10">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
            <Link href="/#pillars" className="hover:text-accent">
              Pillars
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/pillars/${module.pillar.slug}`} className="hover:text-accent">
              {module.pillar.title}
            </Link>
          </nav>

          <h1 className="text-3xl leading-tight font-extrabold text-ink sm:text-[2.6rem]">{module.title}</h1>
          {module.summary && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{module.summary}</p>}

          <div className="mt-6 mb-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-line py-4 text-sm text-ink-subtle">
            <StatusBadge status={module.status} />
            {hasNotes && <span>{readingTime} min read</span>}
            <span>Updated {formatDate(module.updatedAt)}</span>
            {module.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 sm:ml-auto" aria-label="Tags">
                {module.tags.map((t) => (
                  <li key={t} className="rounded-md bg-subtle px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                    #{t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasNotes ? (
            <Prose html={html} />
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-card/50 px-6 py-14 text-center">
              <p className="text-3xl" aria-hidden>
                🌱
              </p>
              <p className="mt-3 font-display text-lg font-bold text-ink">Notes are still growing</p>
              <p className="mx-auto mt-2 max-w-md text-ink-muted">This module is on the roadmap. Study notes will appear here once written.</p>
            </div>
          )}

          <nav className="mt-14 grid gap-4 sm:grid-cols-2" aria-label="Pagination">
            {prev ? (
              <Link href={`/pillars/${module.pillar.slug}/${prev.slug}`} className="group rounded-2xl border border-line bg-card p-5 transition hover:border-accent/40 hover:shadow-md">
                <span className="text-xs text-ink-subtle">← Previous</span>
                <span className="mt-1 block font-display font-bold text-ink group-hover:text-accent">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/pillars/${module.pillar.slug}/${next.slug}`} className="group rounded-2xl border border-line bg-card p-5 text-right transition hover:border-accent/40 hover:shadow-md">
                <span className="text-xs text-ink-subtle">Next →</span>
                <span className="mt-1 block font-display font-bold text-ink group-hover:text-accent">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>
      </main>

      {/* Floating TOC */}
      <aside className="hidden w-64 shrink-0 xl:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pt-10">
          <TableOfContents headings={headings} />
        </div>
      </aside>
    </div>
  );
}
