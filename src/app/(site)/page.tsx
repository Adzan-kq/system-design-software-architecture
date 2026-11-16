import Link from 'next/link';
import { JourneyTimeline } from '@/components/site/JourneyTimeline';
import { PillarGrid } from '@/components/site/PillarGrid';
import { ProgressBar } from '@/components/site/ProgressBar';
import { SectionHeading } from '@/components/site/SectionHeading';
import { StatusBadge } from '@/components/site/StatusBadge';
import { formatDate } from '@/lib/format';
import { getJourney, getPillarsWithStats, getRecentlyUpdatedModules, overallStats } from '@/lib/queries';
import { SITE } from '@/lib/site';

// All data below comes from cached ('use cache') Neon queries, so this page is
// prerendered and refreshed on demand when the admin saves changes.
export default async function HomePage() {
  const [pillars, recent, journey] = await Promise.all([
    getPillarsWithStats(),
    getRecentlyUpdatedModules(4),
    getJourney({ featuredOnly: true }),
  ]);
  const stats = overallStats(pillars);
  const current = journey.find((m) => m.isCurrent);

  const statCards = [
    { label: 'Learning modules', value: stats.total },
    { label: 'Completed', value: stats.completed },
    { label: 'In progress', value: stats.inProgress },
    { label: 'Core pillars', value: pillars.length },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-accent-soft),transparent)] opacity-80 blur-2xl"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-16">
          {current && (
            <p className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-sm text-ink-muted shadow-sm">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="truncate">
                Currently: <span className="font-medium text-ink">{current.title}</span>
              </span>
            </p>
          )}

          <h1 className="max-w-4xl text-4xl leading-[1.1] font-extrabold text-ink sm:text-6xl">
            Hi, I&apos;m {SITE.author}{' '}
            <span className="inline-block" aria-hidden>
              👋
            </span>
            <span className="mt-4 block text-xl leading-snug font-bold text-ink-muted sm:text-3xl">
              Product Engineer evolving toward <span className="text-accent">Software Architect</span> &amp;{' '}
              <span className="text-accent">AI Systems Engineer</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            This is my engineering learning hub. I&apos;m going deep on six pillars, from distributed systems
            to AI engineering, and documenting every module and milestone along the way.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#pillars"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-accent-contrast shadow-sm shadow-accent/20 transition hover:bg-accent-hover hover:shadow-md motion-safe:hover:-translate-y-0.5"
            >
              Explore the 6 Pillars <span aria-hidden>→</span>
            </Link>
            <Link
              href="/journey"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-5 py-3 font-medium text-ink transition hover:border-accent/40 hover:text-accent"
            >
              My Developer Journey
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-24 px-4 sm:px-6">
        {/* Live stats */}
        <section aria-label="Learning stats" className="rounded-2xl border border-line bg-card p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-xs font-medium tracking-wider text-accent uppercase">Overall progress</p>
              <div className="mt-3 flex items-center gap-4">
                <ProgressBar value={stats.percent} label="Overall completion" className="h-2.5" />
                <span className="font-display text-3xl font-bold text-ink">{stats.percent}%</span>
              </div>
              <p className="mt-2 text-sm text-ink-subtle">
                {stats.completed} of {stats.total} modules completed across all pillars.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:border-l lg:border-line lg:pl-8">
              {statCards.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-ink-subtle">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 6-pillar grid */}
        <section id="pillars" className="scroll-mt-20">
          <SectionHeading
            eyebrow="Core engineering pillars"
            title="What I'm learning"
            description="Six pillars beyond the fundamentals. Completion is calculated live from each module's status."
          />
          <PillarGrid pillars={pillars} />
        </section>

        {/* Recently updated */}
        {recent.length > 0 && (
          <section>
            <SectionHeading eyebrow="Digital garden" title="Recently tended modules" />
            <ul className="grid gap-4 md:grid-cols-2">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/pillars/${m.pillar.slug}/${m.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:border-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
                      <StatusBadge status={m.status} size="sm" />
                      <span>{m.pillar.title}</span>
                      {m.readingTime > 0 && <span>· {m.readingTime} min read</span>}
                    </div>
                    <h3 className="mt-3 font-bold text-ink group-hover:text-accent">{m.title}</h3>
                    {m.summary && <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{m.summary}</p>}
                    <p className="mt-auto pt-3 font-mono text-[11px] text-ink-subtle">Updated {formatDate(m.updatedAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Journey preview */}
        <section>
          <SectionHeading
            eyebrow="Developer journey"
            title="How I got here"
            description="Milestones and lessons from growing as an engineer."
            link={{ href: '/journey', label: 'Full timeline' }}
          />
          <div className="max-w-3xl">
            <JourneyTimeline milestones={journey.slice(0, 3)} compact />
          </div>
        </section>
      </main>
    </>
  );
}
