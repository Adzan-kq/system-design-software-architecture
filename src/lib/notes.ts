import { getCollection, type CollectionEntry } from 'astro:content';
import { TOPICS, type Topic } from '../data/topics';

export type Note = CollectionEntry<'notes'>;
export type Status = Note['data']['status'];

export const STATUS_LABEL: Record<Status, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  planned: 'Planned',
};

/** Prefix an internal path with the configured `base` (needed for GitHub Pages). */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export const topicOf = (note: Note) => note.id.split('/')[0];
export const noteHref = (note: Note) => url(`/notes/${note.id}/`);

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  return notes.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export interface TopicGroup extends Topic {
  notes: Note[];
  status: Status;
  completed: number;
  /** 0–100, counting in-progress notes as half done. */
  progress: number;
}

function topicStatus(notes: Note[]): Status {
  if (notes.length > 0 && notes.every((n) => n.data.status === 'completed')) return 'completed';
  if (notes.some((n) => n.data.status !== 'planned')) return 'in-progress';
  return 'planned';
}

function progressOf(notes: Note[]): number {
  if (notes.length === 0) return 0;
  const score = notes.reduce(
    (sum, n) => sum + (n.data.status === 'completed' ? 1 : n.data.status === 'in-progress' ? 0.5 : 0),
    0,
  );
  return Math.round((score / notes.length) * 100);
}

/** Notes grouped by roadmap topic, in roadmap order. Unknown folders are appended. */
export async function getTopicGroups(): Promise<TopicGroup[]> {
  const notes = await getNotes();
  const known = new Set(TOPICS.map((t) => t.slug));
  const extra = [...new Set(notes.map(topicOf))]
    .filter((slug) => !known.has(slug))
    .map((slug) => ({ slug, title: slug.replace(/-/g, ' '), description: '' }));

  return [...TOPICS, ...extra].map((topic) => {
    const topicNotes = notes.filter((n) => topicOf(n) === topic.slug);
    return {
      ...topic,
      notes: topicNotes,
      status: topicStatus(topicNotes),
      completed: topicNotes.filter((n) => n.data.status === 'completed').length,
      progress: progressOf(topicNotes),
    };
  });
}

export function overallProgress(groups: TopicGroup[]) {
  const all = groups.flatMap((g) => g.notes);
  return {
    total: all.length,
    completed: all.filter((n) => n.data.status === 'completed').length,
    inProgress: all.filter((n) => n.data.status === 'in-progress').length,
    planned: all.filter((n) => n.data.status === 'planned').length,
    progress: progressOf(all),
  };
}

/** Estimated reading time in minutes: ~200 wpm for prose, plus ~10 s per code/diagram line. */
export function readingTime(note: Note): number {
  const body = note.body ?? '';
  const codeLines = (body.match(/```[\s\S]*?```/g) ?? []).reduce((n, b) => n + b.split('\n').length, 0);
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200 + codeLines / 6));
}

const topicTitles = new Map(TOPICS.map((t) => [t.slug, t.title]));
export const topicTitle = (note: Note) => topicTitles.get(topicOf(note)) ?? topicOf(note).replace(/-/g, ' ');
