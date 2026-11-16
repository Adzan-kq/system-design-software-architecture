import { getCollection, type CollectionEntry } from 'astro:content';

export type JourneyEntry = CollectionEntry<'journey'>;
export type JourneyType = JourneyEntry['data']['type'];

/** Label + Tailwind classes for each entry type (dot, badge). */
export const JOURNEY_TYPE_META: Record<JourneyType, { label: string; dot: string; badge: string }> = {
  career: {
    label: 'Career',
    dot: 'bg-indigo-500 ring-indigo-500/20',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  },
  learning: {
    label: 'Learning',
    dot: 'bg-sky-500 ring-sky-500/20',
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  },
  project: {
    label: 'Project',
    dot: 'bg-violet-500 ring-violet-500/20',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  },
  certification: {
    label: 'Certification',
    dot: 'bg-emerald-500 ring-emerald-500/20',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  milestone: {
    label: 'Milestone',
    dot: 'bg-amber-500 ring-amber-500/20',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
};

/** Newest first; ongoing entries float to the top. */
export async function getJourney(): Promise<JourneyEntry[]> {
  const entries = await getCollection('journey', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort(
    (a, b) => Number(b.data.current) - Number(a.data.current) || b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** Group entries by the year they started, newest year first. */
export function groupByYear(entries: JourneyEntry[]): [number, JourneyEntry[]][] {
  const map = new Map<number, JourneyEntry[]>();
  for (const e of entries) {
    const y = e.data.date.getUTCFullYear();
    map.set(y, [...(map.get(y) ?? []), e]);
  }
  return [...map.entries()].sort(([a], [b]) => b - a);
}

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function formatRange({ date, endDate, current }: JourneyEntry['data']): string {
  if (current) return `${fmt(date)} — Present`;
  if (endDate) return `${fmt(date)} — ${fmt(endDate)}`;
  return fmt(date);
}

/** Journey entries that link to a given note (for backlinks on note pages). */
export async function getJourneyForNote(noteId: string): Promise<JourneyEntry[]> {
  return (await getJourney()).filter((e) => e.data.relatedNotes.some((r) => r.id === noteId));
}
