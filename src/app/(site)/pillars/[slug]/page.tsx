import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PillarIcon } from '@/components/site/PillarIcon';
import { ProgressBar } from '@/components/site/ProgressBar';
import { StatusBadge } from '@/components/site/StatusBadge';
import { getPillarSlugs, getPillarWithModules } from '@/lib/queries';

export async function generateStaticParams() {
  return getPillarSlugs();
}

export async function generateMetadata({ params }: PageProps<'/pillars/[slug]'>): Promise<Metadata> {
  const pillar = await getPillarWithModules((await params).slug);
  return pillar ? { title: pillar.title, description: pillar.description } : {};
}

export default async function PillarPage({ params }: PageProps<'/pillars/[slug]'>) {
  const pillar = await getPillarWithModules((await params).slug);
  if (!pillar) notFound();

  const inProgress = pillar.modules.filter((m) => m.status === 'IN_PROGRESS').length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-ink-subtle">
        <Link href="/#pillars" className="transition-colors hover:text-accent">
          Pillars
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-muted">{pillar.title}</span>
      </nav>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <PillarIcon slug={pillar.slug} className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-medium tracking-wider text-accent uppercase">Pillar {String(pillar.order).padStart(2, '0')}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{pillar.title}</h1>
          <p className="mt-3 text-lg text-ink-muted">{pillar.description}</p>
        </div>
      </header>

      <div className="mt-8 rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center gap-4">
          <ProgressBar value={pillar.percent} label={`${pillar.title} completion`} className="h-2" />
          <span className="font-display text-xl font-bold">{pillar.percent}%</span>
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          {pillar.completed} completed · {inProgress} in progress · {pillar.modules.length} modules total
        </p>
      </div>

      <ol className="mt-10 space-y-3">
        {pillar.modules.map((m, i) => (
          <li key={m.id}>
            <Link
              href={`/pillars/${pillar.slug}/${m.slug}`}
              className="group flex gap-4 rounded-2xl border border-line bg-card p-5 transition hover:border-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5"
            >
              <span className="mt-0.5 font-mono text-xs text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <h2 className="text-lg font-bold text-ink group-hover:text-accent">{m.title}</h2>
                  <StatusBadge status={m.status} size="sm" />
                </div>
                {m.summary && <p className="mt-1 text-ink-muted">{m.summary}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-subtle">
                  <span>{m.hasNotes ? `${m.readingTime} min read` : 'Notes coming soon'}</span>
                  {m.tags.map((t) => (
                    <span key={t} className="rounded-md bg-subtle px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {pillar.modules.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-line px-6 py-12 text-center text-ink-muted">
          No modules in this pillar yet.
        </p>
      )}
    </main>
  );
}
