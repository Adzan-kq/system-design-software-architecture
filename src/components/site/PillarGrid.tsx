import Link from 'next/link';
import type { PillarSummary } from '@/lib/queries';
import { PillarIcon } from './PillarIcon';
import { ProgressBar } from './ProgressBar';

/** The 6-pillar progress grid. Percentages are computed from module statuses in Neon. */
export function PillarGrid({ pillars }: { pillars: PillarSummary[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pillars.map((p) => (
        <li key={p.id}>
          <Link
            href={`/pillars/${p.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 shadow-sm shadow-stone-900/[0.02] transition duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-stone-900/5 motion-safe:hover:-translate-y-1 dark:shadow-none"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <PillarIcon slug={p.slug} className="size-5" />
              </span>
              <span className="font-mono text-xs text-ink-subtle">{String(p.order).padStart(2, '0')}</span>
            </div>

            <h3 className="mt-5 text-lg leading-snug font-bold text-ink transition-colors group-hover:text-accent">{p.title}</h3>
            <p className="mt-2 mb-6 line-clamp-2 text-sm text-ink-muted">{p.description}</p>

            <div className="mt-auto">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold text-ink">{p.percent}%</span>
                <span className="text-xs text-ink-subtle">
                  {p.completed}/{p.total} completed
                </span>
              </div>
              <ProgressBar value={p.percent} label={`${p.title} progress`} />
              <div className="mt-3 flex gap-3 text-[11px] text-ink-subtle">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-500" aria-hidden /> {p.inProgress} in progress
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-ink-subtle/50" aria-hidden /> {p.planned} planned
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
