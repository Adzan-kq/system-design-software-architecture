import type { MilestoneType } from '@/generated/prisma/enums';
import { MILESTONE_TYPE_LABEL, formatRange } from '@/lib/format';
import type { getJourney } from '@/lib/queries';
import { MermaidRenderer } from '../markdown/MermaidRenderer';

type Milestone = Awaited<ReturnType<typeof getJourney>>[number];

const TYPE_STYLE: Record<MilestoneType, { dot: string; glow: string; badge: string }> = {
  CAREER: {
    dot: 'bg-teal-500 dark:bg-teal-400',
    glow: 'shadow-[0_0_0_4px_var(--color-canvas),0_0_16px_2px_var(--color-teal-500)]',
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300',
  },
  LEARNING: {
    dot: 'bg-sky-500 dark:bg-sky-400',
    glow: 'shadow-[0_0_0_4px_var(--color-canvas),0_0_16px_2px_var(--color-sky-500)]',
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
  },
  PROJECT: {
    dot: 'bg-violet-500 dark:bg-violet-400',
    glow: 'shadow-[0_0_0_4px_var(--color-canvas),0_0_16px_2px_var(--color-violet-500)]',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
  },
  CERTIFICATION: {
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    glow: 'shadow-[0_0_0_4px_var(--color-canvas),0_0_16px_2px_var(--color-emerald-500)]',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
  },
  MILESTONE: {
    dot: 'bg-amber-500 dark:bg-amber-400',
    glow: 'shadow-[0_0_0_4px_var(--color-canvas),0_0_16px_2px_var(--color-amber-500)]',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  },
};

function groupByYear(items: Milestone[]) {
  const map = new Map<number, Milestone[]>();
  for (const m of items) {
    const y = m.startDate.getUTCFullYear();
    map.set(y, [...(map.get(y) ?? []), m]);
  }
  return [...map.entries()].sort(([a], [b]) => b - a);
}

/**
 * Vertical timeline: year badges, glowing milestone dots, cards with an
 * expandable reflection. `compact` hides skills/reflections (home preview).
 */
export function JourneyTimeline({ milestones, compact = false }: { milestones: Milestone[]; compact?: boolean }) {
  if (milestones.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-ink-muted">No milestones yet.</p>;
  }

  return (
    <div className="relative">
      <div
        className="absolute top-2 bottom-2 left-3 w-px -translate-x-1/2 bg-gradient-to-b from-accent/60 via-line to-transparent sm:left-[8.25rem]"
        aria-hidden
      />
      {groupByYear(milestones).map(([year, items]) => (
        <section key={year} aria-label={String(year)} data-year-group className="relative">
          <div className="relative mb-6 grid grid-cols-[1.5rem_1fr] gap-x-4 sm:mb-8 sm:grid-cols-[6.5rem_1.5rem_1fr]">
            <span className="relative z-10 justify-self-start rounded-full border border-accent/30 bg-canvas px-3 py-1 font-mono text-xs font-semibold text-accent shadow-sm sm:col-start-2 sm:justify-self-center">
              {year}
            </span>
          </div>

          <ol className="space-y-6 pb-10">
            {items.map((m) => {
              const style = TYPE_STYLE[m.type];
              const range = formatRange(m.startDate, m.endDate, m.isCurrent);
              return (
                <li
                  key={m.id}
                  id={`m-${m.id}`}
                  data-type={m.type}
                  className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 sm:grid-cols-[6.5rem_1.5rem_1fr]"
                >
                  <time className="hidden pt-[1.15rem] text-right font-mono text-xs leading-5 whitespace-pre-line text-ink-subtle sm:block">
                    {range.replace(' — ', '\n— ')}
                  </time>

                  <span className="relative mt-[1.45rem] flex size-3.5 justify-self-center" aria-hidden>
                    {m.isCurrent && <span className={`absolute inset-0 animate-glow rounded-full ${style.dot}`} />}
                    <span className={`relative size-3.5 rounded-full ${style.dot} ${style.glow}`} />
                  </span>

                  <article
                    className={`rounded-2xl border bg-card p-5 transition hover:shadow-md ${m.isCurrent ? 'border-accent/40' : 'border-line'}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-medium ${style.badge}`}>
                        {MILESTONE_TYPE_LABEL[m.type]}
                      </span>
                      <time className="font-mono text-[11px] text-ink-subtle sm:hidden">{range}</time>
                      {m.isCurrent && (
                        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                          <span className="size-1.5 rounded-full bg-accent" /> Now
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-ink">{m.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-muted">{m.summary}</p>

                    {!compact && m.skills.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
                        {m.skills.map((s) => (
                          <li key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}

                    {!compact && m.linkUrl && !m.reflectionHtml && (
                      <a href={m.linkUrl} target="_blank" rel="noopener" className="mt-4 inline-flex text-sm font-medium text-accent hover:underline">
                        {m.linkLabel ?? 'Link'} ↗
                      </a>
                    )}

                    {!compact && m.reflectionHtml && (
                      <details className="group mt-4">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-accent select-none [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">Read the reflection ▾</span>
                          <span className="hidden group-open:inline">Hide reflection ▴</span>
                        </summary>
                        <div className="prose prose-sm mt-3 max-w-none" dangerouslySetInnerHTML={{ __html: m.reflectionHtml }} />
                        {m.linkUrl && (
                          <a href={m.linkUrl} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-medium text-accent hover:underline">
                            {m.linkLabel ?? 'Link'} ↗
                          </a>
                        )}
                      </details>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {!compact && <MermaidRenderer />}
    </div>
  );
}
